import { test, expect } from '@jest/globals'
import { lstat, mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as GetFolderSizeInternal from '../src/parts/GetFolderSizeInternal/GetFolderSizeInternal.js'

test('getFolderSizeInternal throws error for root path', async () => {
  await expect(GetFolderSizeInternal.getFolderSizeInternal('/')).rejects.toThrow('Invalid path for folder size')
})

test('getFolderSizeInternal returns 0 for non-existent path', async () => {
  const result = await GetFolderSizeInternal.getFolderSizeInternal('/non/existent/path')
  expect(result).toBe(0)
})

test('getFolderSizeInternal counts file and symlink sizes without following symlinks or counting directories', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'get-folder-size-'))
  try {
    const nestedDirectory = join(directory, 'nested')
    const file = join(directory, 'file')
    const nestedFile = join(nestedDirectory, 'nested-file')
    const fileLink = join(directory, 'file-link')
    const loopLink = join(directory, 'loop-link')
    await mkdir(nestedDirectory)
    await writeFile(file, '12345')
    await writeFile(nestedFile, 'abc')
    await symlink('file', fileLink)
    await symlink('.', loopLink)

    const result = await GetFolderSizeInternal.getFolderSizeInternal(directory)
    const fileStats = await lstat(file)
    const nestedFileStats = await lstat(nestedFile)
    const fileLinkStats = await lstat(fileLink)
    const loopLinkStats = await lstat(loopLink)
    const expected = fileStats.size + nestedFileStats.size + fileLinkStats.size + loopLinkStats.size
    expect(result).toBe(expected)
  } finally {
    await rm(directory, { force: true, recursive: true })
  }
})
