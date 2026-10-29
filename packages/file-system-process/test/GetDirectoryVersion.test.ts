import type { BigIntStats } from 'node:fs'
import { beforeEach, expect, jest, test } from '@jest/globals'

const stat = jest.fn<(path: string, options: Readonly<{ bigint: true }>) => Promise<BigIntStats>>()
jest.unstable_mockModule('node:fs/promises', () => ({ stat }))
const { getDirectoryVersion } = await import('../src/parts/GetDirectoryVersion/GetDirectoryVersion.ts')

const oldTime = BigInt(Date.now() - 10_000) * 1_000_000n
const directory = {
  birthtimeNs: 1n,
  ctimeNs: oldTime,
  dev: 2n,
  ino: 3n,
  isDirectory: () => true,
  mtimeNs: oldTime,
  size: 4096n,
} as BigIntStats

beforeEach(() => {
  stat.mockReset()
  stat.mockResolvedValue(directory)
})

test('unchanged directories have a serializable stable version without listing entries', async () => {
  const first = await getDirectoryVersion('file:///workspace')
  expect(typeof first).toBe('string')
  expect(await getDirectoryVersion('file:///workspace')).toBe(first)
  expect(stat).toHaveBeenCalledWith(expect.any(String), { bigint: true })
  expect(JSON.stringify(first)).toContain(first!)
})

test.each(['dev', 'ino', 'size', 'mtimeNs', 'ctimeNs', 'birthtimeNs'] as const)(
  'changing %s invalidates a listing, including nanosecond changes',
  async (field) => {
    const first = await getDirectoryVersion('file:///workspace')
    stat.mockResolvedValue({ ...directory, [field]: directory[field] + 1n })
    expect(await getDirectoryVersion('file:///workspace')).not.toBe(first)
  },
)

test.each(['mtimeNs', 'ctimeNs'] as const)('recent %s disables caching during a timestamp tick', async (field) => {
  stat.mockResolvedValue({ ...directory, [field]: BigInt(Date.now()) * 1_000_000n })
  expect(await getDirectoryVersion('file:///workspace')).toBeNull()
})

test('future timestamps disable caching', async () => {
  stat.mockResolvedValue({ ...directory, mtimeNs: BigInt(Date.now() + 10_000) * 1_000_000n })
  expect(await getDirectoryVersion('file:///workspace')).toBeNull()
})

test('files do not have listing validators', async () => {
  stat.mockResolvedValue({ ...directory, isDirectory: () => false })
  expect(await getDirectoryVersion('file:///workspace/file')).toBeNull()
})

test('filesystem errors are preserved for the caller to handle', async () => {
  const error = new Error('ENOENT')
  stat.mockRejectedValue(error)
  await expect(getDirectoryVersion('file:///missing')).rejects.toBe(error)
})

test('invalid non-file URIs are rejected before filesystem access', async () => {
  await expect(getDirectoryVersion('remote-ssh://host/workspace')).rejects.toThrow()
  expect(stat).not.toHaveBeenCalled()
})
