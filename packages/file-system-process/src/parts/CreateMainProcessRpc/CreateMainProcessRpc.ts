import { type Rpc, TransferElectronMessagePortRpc } from '@lvce-editor/rpc'
import { RpcId } from '@lvce-editor/rpc-registry'
import { VError } from '@lvce-editor/verror'
import { getPortTuple } from '../GetPortTuple/GetPortTuple.ts'
import * as SharedProcess from '../SharedProcess/SharedProcess.ts'

export const createMainProcessRpc = async (): Promise<Rpc> => {
  try {
    const rpc = TransferElectronMessagePortRpc.create({
      commandMap: {},
      getPortTuple,
      async send(port) {
        await SharedProcess.invokeAndTransfer(
          // @ts-ignore
          'TemporaryMessagePort.sendToElectron',
          port,
          RpcId.MainProcess,
          RpcId.FileSystemProcess,
        )
      },
    })
    return rpc
  } catch (error) {
    throw new VError(error, `Failed to create main process rpc`)
  }
}
