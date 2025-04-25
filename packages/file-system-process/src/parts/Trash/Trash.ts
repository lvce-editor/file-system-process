import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as TrashElectron from '../TrashElectron/TrashElectron.ts'
import * as TrashNode from '../TrashNode/TrashNode.ts'
import { VError } from '../VError/VError.ts'

const getFn = () => {
  if (IsElectron.isElectron) {
    return TrashElectron.trash
  }
  return TrashNode.trash
}

// @ts-ignore
export const trash = async (path) => {
  try {
    const fn = getFn()
    await fn(path)
  } catch (error) {
    throw new VError(error, 'Failed to move item to trash')
  }
}
