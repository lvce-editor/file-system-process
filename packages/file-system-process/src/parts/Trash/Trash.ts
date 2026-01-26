import * as GetTrashFn from '../GetTrashFn/GetTrashFn.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import { VError } from '../VError/VError.ts'

export const trash = async (path: string): Promise<void> => {
  // TODO pass iselectron as parameter
  // TODO only accept file uris
  if (!path || path.trim() === '') {
    throw new Error('Path cannot be empty')
  }
  try {
    const fn = GetTrashFn.getTrashFn(IsElectron.isElectron)
    await fn(path)
  } catch (error) {
    throw new VError(error, 'Failed to move item to trash')
  }
}
