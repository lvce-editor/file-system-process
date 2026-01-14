import { MainProcess } from '@lvce-editor/rpc-registry'
import { existsSync } from 'node:fs'

export const trash = async (path: string): Promise<void> => {
  if (!existsSync(path)) {
    return
  }
  await MainProcess.invoke('Trash.trash', path)
}
