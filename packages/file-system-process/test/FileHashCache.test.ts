import { beforeEach, expect, jest, test } from '@jest/globals'
import { join } from 'node:path'

const mockMkdir = jest.fn<(path: string, options: { recursive: boolean }) => Promise<void>>()
const mockReadFile = jest.fn<(path: string, encoding: string) => Promise<string>>()
const mockRename = jest.fn<(source: string, target: string) => Promise<void>>()
const mockRm = jest.fn<(path: string, options: { force: boolean }) => Promise<void>>()
const mockWriteFile = jest.fn<(path: string, content: string) => Promise<void>>()

jest.unstable_mockModule('node:fs/promises', () => ({
  mkdir: mockMkdir,
  readFile: mockReadFile,
  rename: mockRename,
  rm: mockRm,
  writeFile: mockWriteFile,
}))

const FileHashCache = await import('../src/parts/FileHashCache/FileHashCache.js')

const cacheDirectory = join('cache', 'lvce')
const cacheFolder = join(cacheDirectory, 'file-system-process')
const cachePath = join(cacheFolder, 'file-hashes-v1.json')
const temporaryPath = `${cachePath}.${process.pid}.tmp`
const hash = 'a'.repeat(64)

beforeEach(() => {
  FileHashCache.configure()
  jest.clearAllMocks()
  mockMkdir.mockResolvedValue(undefined)
  mockRename.mockResolvedValue(undefined)
  mockRm.mockResolvedValue(undefined)
  mockWriteFile.mockResolvedValue(undefined)
})

test('loads a persisted hash lazily', async () => {
  mockReadFile.mockResolvedValue(
    JSON.stringify({
      entries: [['/workspace/file.ts', '1:2:3:4:5', hash]],
      version: 1,
    }),
  )
  FileHashCache.configure(cacheDirectory)

  expect(mockReadFile).not.toHaveBeenCalled()
  await FileHashCache.ensureLoaded()

  expect(mockReadFile).toHaveBeenCalledWith(cachePath, 'utf8')
  expect(FileHashCache.get('/workspace/file.ts', '1:2:3:4:5')).toBe(hash)
})

test.each([
  'not json',
  JSON.stringify({ entries: [], version: 2 }),
  JSON.stringify({ entries: [['/workspace/file.ts', 'fingerprint', 'invalid']], version: 1 }),
])('ignores an invalid persistent cache', async (content) => {
  mockReadFile.mockResolvedValue(content)
  FileHashCache.configure(cacheDirectory)

  await expect(FileHashCache.ensureLoaded()).resolves.toBeUndefined()
  expect(FileHashCache.get('/workspace/file.ts', 'fingerprint')).toBeUndefined()
})

test('persists dirty entries atomically', async () => {
  mockReadFile.mockRejectedValue(Object.assign(new Error('missing'), { code: 'ENOENT' }))
  FileHashCache.configure(cacheDirectory)
  await FileHashCache.ensureLoaded()
  FileHashCache.set('/workspace/file.ts', '1:2:3:4:5', hash)

  await FileHashCache.flush()

  expect(mockMkdir).toHaveBeenCalledWith(cacheFolder, { recursive: true })
  expect(mockWriteFile).toHaveBeenCalledWith(
    temporaryPath,
    JSON.stringify({ entries: [['/workspace/file.ts', '1:2:3:4:5', hash]], version: 1 }),
  )
  expect(mockRename).toHaveBeenCalledWith(temporaryPath, cachePath)
})

test('does not rewrite an unchanged cache', async () => {
  mockReadFile.mockResolvedValue(JSON.stringify({ entries: [['/workspace/file.ts', '1:2:3:4:5', hash]], version: 1 }))
  FileHashCache.configure(cacheDirectory)
  await FileHashCache.ensureLoaded()
  expect(FileHashCache.get('/workspace/file.ts', '1:2:3:4:5')).toBe(hash)

  await FileHashCache.flush()

  expect(mockWriteFile).not.toHaveBeenCalled()
})

test('retries after a failed persistent cache write', async () => {
  mockReadFile.mockRejectedValue(new Error('missing'))
  mockWriteFile.mockRejectedValueOnce(new Error('readonly'))
  FileHashCache.configure(cacheDirectory)
  await FileHashCache.ensureLoaded()
  FileHashCache.set('/workspace/file.ts', '1:2:3:4:5', hash)

  await expect(FileHashCache.flush()).resolves.toBeUndefined()
  expect(mockRm).toHaveBeenCalledWith(temporaryPath, { force: true })

  await FileHashCache.flush()
  expect(mockWriteFile).toHaveBeenCalledTimes(2)
  expect(mockRename).toHaveBeenCalledTimes(1)
})

test('serializes concurrent changes without losing entries', async () => {
  mockReadFile.mockRejectedValue(new Error('missing'))
  const { promise: firstWrite, resolve: finishFirstWrite } = Promise.withResolvers<void>()
  const { promise: firstWriteStarted, resolve: notifyFirstWrite } = Promise.withResolvers<void>()
  const writtenContents: string[] = []
  mockWriteFile.mockImplementation(async (_path: string, content: string) => {
    writtenContents.push(content)
    if (writtenContents.length === 1) {
      notifyFirstWrite()
      await firstWrite
    }
  })
  FileHashCache.configure(cacheDirectory)
  await FileHashCache.ensureLoaded()
  FileHashCache.set('/workspace/first.ts', 'first', hash)

  const firstFlush = FileHashCache.flush()
  await firstWriteStarted
  FileHashCache.set('/workspace/second.ts', 'second', hash)
  const secondFlush = FileHashCache.flush()
  finishFirstWrite()
  await Promise.all([firstFlush, secondFlush])

  expect(mockWriteFile).toHaveBeenCalledTimes(2)
  expect(JSON.parse(writtenContents.at(-1) || '').entries).toEqual([
    ['/workspace/first.ts', 'first', hash],
    ['/workspace/second.ts', 'second', hash],
  ])
})

test('removes deleted entries from the persistent cache', async () => {
  mockReadFile.mockResolvedValue(JSON.stringify({ entries: [['/workspace/file.ts', 'fingerprint', hash]], version: 1 }))
  FileHashCache.configure(cacheDirectory)
  await FileHashCache.ensureLoaded()

  FileHashCache.remove('/workspace/file.ts')
  await FileHashCache.flush()

  const content = mockWriteFile.mock.calls[0][1]
  expect(JSON.parse(content).entries).toEqual([])
})

test('keeps at most fifty thousand entries', async () => {
  mockReadFile.mockRejectedValue(new Error('missing'))
  FileHashCache.configure(cacheDirectory)
  await FileHashCache.ensureLoaded()
  for (let index = 0; index <= 50_000; index++) {
    FileHashCache.set(`/workspace/${index}.ts`, String(index), hash)
  }

  await FileHashCache.flush()

  const content = mockWriteFile.mock.calls[0][1]
  const persisted = JSON.parse(content)
  expect(persisted.entries).toHaveLength(50_000)
  expect(persisted.entries[0][0]).toBe('/workspace/1.ts')
  expect(persisted.entries.at(-1)[0]).toBe('/workspace/50000.ts')
})
