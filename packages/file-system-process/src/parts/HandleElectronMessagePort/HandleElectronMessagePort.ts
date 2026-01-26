import { ElectronMessagePortRpcClient } from '@lvce-editor/rpc'
import { set } from '@lvce-editor/rpc-registry'
import * as Assert from '../Assert/Assert.ts'

export const handleElectronMessagePort = async (messagePort: any, rpcId?: number): Promise<void> => {
  Assert.object(messagePort)
  const rpc = await ElectronMessagePortRpcClient.create({
    commandMap: {},
    messagePort,
    requiresSocket: false,
  })
  if (rpcId) {
    set(rpcId, rpc)
  }
}
