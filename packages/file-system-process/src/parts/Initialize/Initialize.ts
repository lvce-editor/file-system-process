import type { MessagePortMain } from 'electron'
import * as CreateMainProcessRpc from '../CreateMainProcessRpc/CreateMainProcessRpc.ts'
import * as MainProcess from '../MainProcess/MainProcess.ts'

export const initialize = async (port: MessagePortMain | undefined): Promise<void> => {
  if (!port) {
    return
  }
  // TODO only connect to main process if platform is electron else not
  const rpc = await CreateMainProcessRpc.createMainProcessRpc(port)
  MainProcess.set(rpc)
}
