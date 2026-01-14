import { LazyTransferElectronMessagePortRpc } from '@lvce-editor/rpc'
import { MainProcess, RpcId } from '@lvce-editor/rpc-registry'
import { getPortTuple } from '../GetPortTuple/GetPortTuple.ts'
import * as SharedProcess from '../SharedProcess/SharedProcess.ts'

export const createMainProcessRpc = async (): Promise<void> => {
  const rpc = await LazyTransferElectronMessagePortRpc.create({
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
  MainProcess.set(rpc)
}
