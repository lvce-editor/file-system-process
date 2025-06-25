import { test, expect } from '@jest/globals'
import * as GetFolderSizeInternal from '../src/parts/GetFolderSizeInternal/GetFolderSizeInternal.js'

test('getFolderSizeInternal throws error for root path', async () => {
  await expect(GetFolderSizeInternal.getFolderSizeInternal('/')).rejects.toThrow('Invalid path for folder size')
})

test('getFolderSizeInternal returns 0 for non-existent path', async () => {
  const result = await GetFolderSizeInternal.getFolderSizeInternal('/non/existent/path')
  expect(result).toBe(0)
})
