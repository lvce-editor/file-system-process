import { existsSync } from 'node:fs'
import * as ParentIpc from '../ParentIpc/ParentIpc.ts'

// @ts-ignore
export const trash = async (path) => {
  if (!existsSync(path)) {
    return
  }
  await ParentIpc.invoke('Trash.trash', path)
}
