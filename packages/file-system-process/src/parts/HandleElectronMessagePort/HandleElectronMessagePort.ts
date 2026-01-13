import { set } from '@lvce-editor/rpc-registry'
import * as Assert from '../Assert/Assert.ts'
import * as IpcChild from '../IpcChild/IpcChild.ts'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'

export const handleElectronMessagePort = async (messagePort: any, rpcId?: number): Promise<void> => {
  Assert.object(messagePort)
  const rpc = await IpcChild.listen({
    messagePort,
    method: IpcChildType.ElectronMessagePort,
  })
  if (rpcId) {
    set(rpcId, rpc)
  }
}
