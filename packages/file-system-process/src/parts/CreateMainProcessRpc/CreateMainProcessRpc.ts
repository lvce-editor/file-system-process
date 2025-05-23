import type { MessagePortMain } from 'electron'
import { type Rpc, ElectronMessagePortRpcClient } from '@lvce-editor/rpc'
import { VError } from '@lvce-editor/verror'

export const createMainProcessRpc = async (port: MessagePortMain): Promise<Rpc> => {
  try {
    const rpc = await ElectronMessagePortRpcClient.create({
      commandMap: {},
      messagePort: port,
    })
    return rpc
  } catch (error) {
    throw new VError(error, `Failed to create main process rpc`)
  }
}
