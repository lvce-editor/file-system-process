import * as GetTrashFn from '../GetTrashFn/GetTrashFn.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import { VError } from '../VError/VError.ts'

export const trash = async (path: string): Promise<void> => {
  try {
    const fn = GetTrashFn.getTrashFn(IsElectron.isElectron)
    await fn(path)
  } catch (error) {
    throw new VError(error, 'Failed to move item to trash')
  }
}
