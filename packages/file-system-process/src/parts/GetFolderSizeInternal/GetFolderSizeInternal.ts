import * as fs from 'node:fs/promises'
import { join } from 'node:path'

export const getFolderSizeInternal = async (path: string): Promise<number> => {
  if (path === '/') {
    throw new Error('Invalid path for folder size')
  }
  let total = 0
  try {
    const stats = await fs.lstat(path)
    if (stats.isDirectory()) {
      const dirents = await fs.readdir(path)
      for (const dirent of dirents) {
        total += await getFolderSizeInternal(join(path, dirent))
      }
    } else {
      total += stats.size
    }
  } catch {
    return 0
  }
  return total
}
