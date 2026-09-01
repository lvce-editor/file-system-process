import * as FileHashCache from '../FileHashCache/FileHashCache.ts'

export const initialize = async (cacheDirectory?: string): Promise<void> => {
  FileHashCache.configure(cacheDirectory)
}
