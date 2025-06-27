import { dirname } from 'node:path'
import { mkdir, writeFile } from '../FileSystemDisk/FileSystemDisk.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as Json from '../Json/Json.js'

export const setRecentlyOpened = async (recentlyOpenedPath: string, newRecentlyOpened: readonly string[]): Promise<void> => {
  const stringified = Json.stringify(newRecentlyOpened)
  try {
    await writeFile(recentlyOpenedPath, stringified)
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      await mkdir(dirname(recentlyOpenedPath))
      await writeFile(recentlyOpenedPath, stringified)
      return
    }
    throw error
  }
}
