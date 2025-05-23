import { existsSync } from 'node:fs'
import * as MainProcess from '../MainProcess/MainProcess.ts'

export const trash = async (path: string): Promise<void> => {
  if (!existsSync(path)) {
    return
  }
  // @ts-ignore
  await MainProcess.invoke('Trash.trash', path)
}
