import { type Rpc, ElectronMessagePortRpcClient } from '@lvce-editor/rpc'
import { RpcId } from '@lvce-editor/rpc-registry'
import { VError } from '@lvce-editor/verror'
import { getPortTuple } from '../GetPortTuple/GetPortTuple.ts'
import * as SharedProcess from '../SharedProcess/SharedProcess.ts'

export const createMainProcessRpc = async (): Promise<Rpc> => {
  try {
    const { port1, port2 } = await getPortTuple()
    await SharedProcess.invokeAndTransfer(
      // @ts-ignore
      'TemporaryMessagePort.sendToElectron',
      port1,
      RpcId.MainProcess,
      RpcId.FileSystemProcess,
    )
    const rpc = await ElectronMessagePortRpcClient.create({
      commandMap: {},
      messagePort: port2,
    })
    return rpc
  } catch (error) {
    throw new VError(error, `Failed to create main process rpc`)
  }
}
