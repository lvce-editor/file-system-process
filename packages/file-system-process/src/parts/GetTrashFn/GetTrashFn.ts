import * as TrashElectron from '../TrashElectron/TrashElectron.ts'
import * as TrashNode from '../TrashNode/TrashNode.ts'

export const getTrashFn = (isElectron: boolean) => {
  if (isElectron) {
    return TrashElectron.trash
  }
  return TrashNode.trash
}
