import { LazyTransferElectronMessagePortRpc } from '@lvce-editor/rpc'
import { MainProcess, RpcId, SharedProcess } from '@lvce-editor/rpc-registry'
import { getPortTuple } from '../GetPortTuple/GetPortTuple.ts'

export const initializeMainProcessRpc = async (): Promise<void> => {
  const rpc = await LazyTransferElectronMessagePortRpc.create({
    commandMap: {},
    getPortTuple,
    async send(port) {
      await SharedProcess.invokeAndTransfer(
        'TemporaryMessagePort.sendToElectron',
        port,
        RpcId.MainProcess,
        RpcId.FileSystemProcess,
      )
    },
  })
  MainProcess.set(rpc)
}
