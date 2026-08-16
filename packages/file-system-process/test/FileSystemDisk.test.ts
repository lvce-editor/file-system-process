import { test, expect, jest } from '@jest/globals'
import { constants } from 'node:fs'

// Mock functions
const mockCp = jest.fn()
const mockAccess = jest.fn<(path: string, mode: number) => Promise<void>>()
const mockReadFile = jest.fn()
const mockWriteFile = jest.fn()
const mockReaddir = jest.fn()
const mockMkdir = jest.fn()
const mockLstat = jest.fn()
const mockRename = jest.fn()
const mockStat = jest.fn()
const mockChmod = jest.fn()
const mockRm = jest.fn()
const mockFileURLToPath = jest.fn()
const mockHomedir = jest.fn()
const mockTrash = jest.fn()
const mockIsEnoentError = jest.fn()
const mockGetDirentType = jest.fn()
const mockGetFolderSizeInternal = jest.fn()

// Setup all mocks at the top
jest.unstable_mockModule('node:fs/promises', () => ({
  access: mockAccess,
  chmod: mockChmod,
  cp: mockCp,
  lstat: mockLstat,
  mkdir: mockMkdir,
  readdir: mockReaddir,
  readFile: mockReadFile,
  rename: mockRename,
  rm: mockRm,
  stat: mockStat,
  writeFile: mockWriteFile,
}))

jest.unstable_mockModule('node:url', () => ({
  fileURLToPath: mockFileURLToPath,
}))

jest.unstable_mockModule('node:os', () => ({
  homedir: mockHomedir,
}))

jest.unstable_mockModule('../src/parts/Trash/Trash.js', () => ({
  trash: mockTrash,
}))

jest.unstable_mockModule('../src/parts/IsEnoentError/IsEnoentError.js', () => ({
  isEnoentError: mockIsEnoentError,
}))

jest.unstable_mockModule('../src/parts/GetDirentType/GetDirentType.js', () => ({
  getDirentType: mockGetDirentType,
}))

jest.unstable_mockModule('../src/parts/GetFolderSizeInternal/GetFolderSizeInternal.js', () => ({
  getFolderSizeInternal: mockGetFolderSizeInternal,
}))

test('getPathSeparator should return forward slash', async (): Promise<void> => {
  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  const result = FileSystemDisk.getPathSeparator()
  expect(result).toBe('/')
})

test('isReadonly should return false when directory is writable', async (): Promise<void> => {
  mockAccess.mockResolvedValue(undefined)
  mockFileURLToPath.mockReturnValue('/test')
  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')

  expect(await FileSystemDisk.isReadonly('file:///test')).toBe(false)
  expect(mockAccess).toHaveBeenCalledWith('/test', constants.W_OK)
})

test.each(['EACCES', 'EROFS'])('isReadonly should return true for %s', async (code): Promise<void> => {
  mockAccess.mockRejectedValue(Object.assign(new Error('readonly'), { code }))
  mockFileURLToPath.mockReturnValue('/test')
  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')

  expect(await FileSystemDisk.isReadonly('file:///test')).toBe(true)
})

test('isReadonly should preserve unexpected errors', async (): Promise<void> => {
  mockAccess.mockRejectedValue(Object.assign(new Error('missing'), { code: 'ENOENT' }))
  mockFileURLToPath.mockReturnValue('/test')
  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')

  await expect(FileSystemDisk.isReadonly('file:///test')).rejects.toThrow('Failed to check whether "file:///test" is readonly')
})

test('copy should copy files successfully', async (): Promise<void> => {
  // @ts-ignore
  mockCp.mockResolvedValue(undefined)
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')

  await FileSystemDisk.copy('file:///source', 'file:///target')

  expect(mockFileURLToPath).toHaveBeenCalledWith('file:///source')
  expect(mockFileURLToPath).toHaveBeenCalledWith('file:///target')
  expect(mockCp).toHaveBeenCalledWith('/source', '/target', { recursive: true })
})

test('copy should throw error for invalid source URI', async (): Promise<void> => {
  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  await expect(FileSystemDisk.copy('invalid://source', 'file:///target')).rejects.toThrow('path must be a valid file uri')
})

test('copy should throw error for invalid target URI', async (): Promise<void> => {
  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  await expect(FileSystemDisk.copy('file:///source', 'invalid://target')).rejects.toThrow('path must be a valid file uri')
})

test('copy should handle same source and dest error', async (): Promise<void> => {
  const error = new Error('Invalid src or dest: cp returned EINVAL (src and dest cannot be the same)')
  // @ts-ignore
  mockCp.mockRejectedValue(error)
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  await expect(FileSystemDisk.copy('file:///same', 'file:///same')).rejects.toThrow(
    'Failed to copy "file:///same" to "file:///same": src and dest cannot be the same',
  )
})

test('readFile should read file successfully', async (): Promise<void> => {
  const content = 'file content'
  // @ts-ignore
  mockReadFile.mockResolvedValue(content)
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  const result = await FileSystemDisk.readFile('file:///test.txt')

  expect(mockFileURLToPath).toHaveBeenCalledWith('file:///test.txt')
  expect(mockReadFile).toHaveBeenCalledWith('/test.txt', 'utf8')
  expect(result).toBe(content)
})

test('readFile should read file with custom encoding', async (): Promise<void> => {
  const content = Buffer.from('binary content')
  // @ts-ignore
  mockReadFile.mockResolvedValue(content)
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  await FileSystemDisk.readFile('file:///test.bin', 'binary')

  expect(mockReadFile).toHaveBeenCalledWith('/test.bin', 'binary')
})

test('getFileHash should return the sha256 hash', async (): Promise<void> => {
  // @ts-ignore
  mockReadFile.mockResolvedValue(Buffer.from('file content'))
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  const result = await FileSystemDisk.getFileHash('file:///test.txt')

  expect(mockFileURLToPath).toHaveBeenCalledWith('file:///test.txt')
  expect(mockReadFile).toHaveBeenCalledWith('/test.txt')
  expect(result).toBe('e0ac3601005dfa1864f5392aabaf7d898b1b5bab854f1acb4491bcd806b76b0c')
})

test('getFileHash should throw FileNotFoundError for missing file', async (): Promise<void> => {
  const error = new Error('ENOENT')
  // @ts-ignore
  mockReadFile.mockRejectedValue(error)
  mockIsEnoentError.mockReturnValue(true)
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')

  await expect(FileSystemDisk.getFileHash('file:///missing.txt')).rejects.toThrow('File not found')
})

test('getFileHashes should return hashes in uri order and null for missing files', async (): Promise<void> => {
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))
  // @ts-ignore
  mockReadFile.mockImplementation(async (path: string) => {
    if (path === '/missing.txt') {
      throw new Error('ENOENT')
    }
    return Buffer.from(path)
  })
  mockIsEnoentError.mockImplementation((error: unknown) => error instanceof Error && error.message === 'ENOENT')
  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')

  const result = await FileSystemDisk.getFileHashes(['file:///first.txt', 'file:///missing.txt', 'file:///second.txt'])

  expect(result).toEqual([
    '33b90cce76cc7c91dc57b14be407ed22ceb1c0a04911b021997ec9c6d2e81e08',
    null,
    '2f5babddddb5b319348271b962fad17ff9cabc2bb2a297262e02323e06a58ad2',
  ])
})

test('getFileHashes should reject a non-array input', async (): Promise<void> => {
  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')

  // @ts-expect-error Testing runtime input validation
  await expect(FileSystemDisk.getFileHashes('file:///test.txt')).rejects.toThrow('uris must be an array')
})

test('readFile should throw FileNotFoundError for missing file', async (): Promise<void> => {
  const error = new Error('ENOENT')
  // @ts-ignore
  mockReadFile.mockRejectedValue(error)
  mockIsEnoentError.mockReturnValue(true)
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  await expect(FileSystemDisk.readFile('file:///missing.txt')).rejects.toThrow('File not found')
})

test('writeFile should write file successfully', async (): Promise<void> => {
  // @ts-ignore
  mockWriteFile.mockResolvedValue(undefined)
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  await FileSystemDisk.writeFile('file:///test.txt', 'content')

  expect(mockFileURLToPath).toHaveBeenCalledWith('file:///test.txt')
  expect(mockWriteFile).toHaveBeenCalledWith('/test.txt', 'content', 'utf8')
})

test('writeFile should write file with custom encoding', async (): Promise<void> => {
  // @ts-ignore
  mockWriteFile.mockResolvedValue(undefined)
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  await FileSystemDisk.writeFile('file:///test.txt', 'content', 'binary')

  expect(mockWriteFile).toHaveBeenCalledWith('/test.txt', 'content', 'binary')
})

test('remove should remove file successfully', async (): Promise<void> => {
  // @ts-ignore
  mockTrash.mockResolvedValue(undefined)
  mockHomedir.mockReturnValue('/home/user')
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  await FileSystemDisk.remove('file:///test.txt')

  expect(mockFileURLToPath).toHaveBeenCalledWith('file:///test.txt')
  expect(mockTrash).toHaveBeenCalledWith('/test.txt')
})

test('remove should not remove root directory', async (): Promise<void> => {
  // @ts-ignore
  const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  await FileSystemDisk.remove('file:///')

  expect(consoleSpy).toHaveBeenCalledWith('not removing path')
  consoleSpy.mockRestore()
})

test('remove should not remove home directory', async (): Promise<void> => {
  // @ts-ignore
  const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
  mockHomedir.mockReturnValue('/home/user')
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  await FileSystemDisk.remove('file:///home/user')

  expect(consoleSpy).toHaveBeenCalledWith('not removing path')
  consoleSpy.mockRestore()
})

test('remove should throw VError when trash fails', async (): Promise<void> => {
  const error = new Error('Trash failed')
  // @ts-ignore
  mockTrash.mockRejectedValue(error)
  mockHomedir.mockReturnValue('/home/user')
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  await expect(FileSystemDisk.remove('file:///test.txt')).rejects.toThrow('Failed to remove "file:///test.txt"')
})

test('forceRemove permanently removes a directory without following symbolic links', async (): Promise<void> => {
  mockFileURLToPath.mockReturnValue('/test')
  // @ts-ignore
  mockLstat.mockResolvedValue({ isDirectory: () => true, isSymbolicLink: () => false })
  // @ts-ignore
  mockRm.mockResolvedValue(undefined)
  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')

  await FileSystemDisk.forceRemove('file:///test')

  expect(mockRm).toHaveBeenCalledWith('/test', { force: false, recursive: true })
})

test('forceRemove removes a symbolic link without recursively traversing it', async (): Promise<void> => {
  mockFileURLToPath.mockReturnValue('/test-link')
  // @ts-ignore
  mockLstat.mockResolvedValue({ isDirectory: () => false, isSymbolicLink: () => true })
  // @ts-ignore
  mockRm.mockResolvedValue(undefined)
  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')

  await FileSystemDisk.forceRemove('file:///test-link')

  expect(mockRm).toHaveBeenCalledWith('/test-link', { force: false, recursive: false })
})

test.each(['/', '~', '/home/user'])('forceRemove rejects protected path %s', async (path): Promise<void> => {
  mockRm.mockClear()
  mockFileURLToPath.mockReturnValue(path)
  mockHomedir.mockReturnValue('/home/user')
  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')

  await expect(FileSystemDisk.forceRemove(`file://${path}`)).rejects.toThrow('Cannot remove a filesystem root or home directory')
  expect(mockRm).not.toHaveBeenCalled()
})

test('readDirWithFileTypes should read directory successfully', async (): Promise<void> => {
  const mockDirents = [
    {
      isBlockDevice: (): boolean => false,
      isCharacterDevice: (): boolean => false,
      isDirectory: (): boolean => false,
      isFIFO: (): boolean => false,
      isFile: (): boolean => true,
      isSocket: (): boolean => false,
      isSymbolicLink: (): boolean => false,
      name: 'file1.txt',
    },
    {
      isBlockDevice: (): boolean => false,
      isCharacterDevice: (): boolean => false,
      isDirectory: (): boolean => true,
      isFIFO: (): boolean => false,
      isFile: (): boolean => false,
      isSocket: (): boolean => false,
      isSymbolicLink: (): boolean => false,
      name: 'dir1',
    },
  ]
  // @ts-ignore
  mockReaddir.mockResolvedValue(mockDirents)
  mockGetDirentType
    .mockReturnValueOnce(1) // File
    .mockReturnValueOnce(2) // Directory
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  const result = await FileSystemDisk.readDirWithFileTypes('file:///test')

  expect(mockFileURLToPath).toHaveBeenCalledWith('file:///test')
  expect(mockReaddir).toHaveBeenCalledWith('/test', { withFileTypes: true })
  expect(result).toHaveLength(2)
  expect(result[0]).toEqual({ name: 'file1.txt', type: 1 })
  expect(result[1]).toEqual({ name: 'dir1', type: 2 })
})

test('readDirWithFileTypes should throw VError when directory read fails', async (): Promise<void> => {
  const error = new Error('Permission denied')
  // @ts-ignore
  mockReaddir.mockRejectedValue(error)
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  await expect(FileSystemDisk.readDirWithFileTypes('file:///test')).rejects.toThrow('Failed to read directory "file:///test"')
})

test('mkdir should create directory successfully', async (): Promise<void> => {
  // @ts-ignore
  mockMkdir.mockResolvedValue(undefined)
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  await FileSystemDisk.mkdir('file:///newdir')

  expect(mockFileURLToPath).toHaveBeenCalledWith('file:///newdir')
  expect(mockMkdir).toHaveBeenCalledWith('/newdir', { recursive: true })
})

test('mkdir should throw VError when directory creation fails', async (): Promise<void> => {
  const error = new Error('Permission denied')
  // @ts-ignore
  mockMkdir.mockRejectedValue(error)
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  await expect(FileSystemDisk.mkdir('file:///newdir')).rejects.toThrow('Failed to create directory "file:///newdir"')
})

test('rename should rename file successfully', async (): Promise<void> => {
  // @ts-ignore
  mockRename.mockResolvedValue(undefined)
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  await FileSystemDisk.rename('file:///old.txt', 'file:///new.txt')

  expect(mockFileURLToPath).toHaveBeenCalledWith('file:///old.txt')
  expect(mockFileURLToPath).toHaveBeenCalledWith('file:///new.txt')
  expect(mockRename).toHaveBeenCalledWith('/old.txt', '/new.txt')
})

test('rename should use fallback rename for EXDEV error', async (): Promise<void> => {
  const error = { code: 'EXDEV' }
  // @ts-ignore
  mockRename.mockRejectedValue(error)
  // @ts-ignore
  mockCp.mockResolvedValue(undefined)
  // @ts-ignore
  mockRm.mockResolvedValue(undefined)
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  await FileSystemDisk.rename('file:///old.txt', 'file:///new.txt')

  expect(mockCp).toHaveBeenCalledWith('/old.txt', '/new.txt', { recursive: true })
  expect(mockRm).toHaveBeenCalledWith('/old.txt', { recursive: true })
})

test('rename should throw VError for other rename errors', async (): Promise<void> => {
  const error = new Error('Permission denied')
  // @ts-ignore
  mockRename.mockRejectedValue(error)
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  await expect(FileSystemDisk.rename('file:///old.txt', 'file:///new.txt')).rejects.toThrow(
    'Failed to rename "file:///old.txt" to "file:///new.txt"',
  )
})

test('stat should get file stats successfully', async (): Promise<void> => {
  const mockStats = {
    isBlockDevice: (): boolean => false,
    isCharacterDevice: (): boolean => false,
    isDirectory: (): boolean => false,
    isFIFO: (): boolean => false,
    isFile: (): boolean => true,
    isSocket: (): boolean => false,
    isSymbolicLink: (): boolean => false,
  }
  // @ts-ignore
  mockStat.mockResolvedValue(mockStats)
  mockGetDirentType.mockReturnValue(1) // File
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  const result = await FileSystemDisk.stat('file:///test.txt')

  expect(mockFileURLToPath).toHaveBeenCalledWith('file:///test.txt')
  expect(mockStat).toHaveBeenCalledWith('/test.txt')
  expect(result).toBe(1)
})

test('chmod should change file permissions successfully', async (): Promise<void> => {
  // @ts-ignore
  mockChmod.mockResolvedValue(undefined)
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  await FileSystemDisk.chmod('file:///test.txt', 0o644)

  expect(mockFileURLToPath).toHaveBeenCalledWith('file:///test.txt')
  expect(mockChmod).toHaveBeenCalledWith('/test.txt', 0o644)
})

test('readJson should read JSON file successfully', async (): Promise<void> => {
  const jsonContent = '{"key": "value"}'
  // @ts-ignore
  mockReadFile.mockResolvedValue(jsonContent)
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  const result = await FileSystemDisk.readJson('file:///test.json')

  expect(mockFileURLToPath).toHaveBeenCalledWith('file:///test.json')
  expect(mockReadFile).toHaveBeenCalledWith('/test.json', 'utf8')
  expect(result).toEqual({ key: 'value' })
})

test('readJson should throw FileNotFoundError for missing JSON file', async (): Promise<void> => {
  const error = new Error('ENOENT')
  // @ts-ignore
  mockReadFile.mockRejectedValue(error)
  mockIsEnoentError.mockReturnValue(true)
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  await expect(FileSystemDisk.readJson('file:///missing.json')).rejects.toThrow('File not found')
})

test('readJson should throw VError for invalid JSON', async (): Promise<void> => {
  const invalidJson = 'invalid json'
  // @ts-ignore
  mockReadFile.mockResolvedValue(invalidJson)
  mockIsEnoentError.mockReturnValue(false)
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  await expect(FileSystemDisk.readJson('file:///invalid.json')).rejects.toThrow('Failed to read file as json')
})

test('getFolderSize should get folder size successfully', async (): Promise<void> => {
  // @ts-ignore
  mockGetFolderSizeInternal.mockResolvedValue(1024)
  // @ts-ignore
  mockFileURLToPath.mockImplementation((url: string): string => url.replace('file://', ''))

  const FileSystemDisk = await import('../src/parts/FileSystemDisk/FileSystemDisk.js')
  const result = await FileSystemDisk.getFolderSize('file:///testdir')

  expect(mockFileURLToPath).toHaveBeenCalledWith('file:///testdir')
  expect(mockGetFolderSizeInternal).toHaveBeenCalledWith('/testdir')
  expect(result).toBe(1024)
})
