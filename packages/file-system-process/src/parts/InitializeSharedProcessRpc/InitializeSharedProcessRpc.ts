import type { Rpc } from '@lvce-editor/rpc'
import { ElectronUtilityProcessRpcClient, NodeForkedProcessRpcClient, NodeWorkerRpcClient } from '@lvce-editor/rpc'
import { SharedProcess } from '@lvce-editor/rpc-registry'
import * as CommandMap from '../CommandMap/CommandMap.ts'

const getRpc = (argv: readonly string[]): Promise<Rpc> => {
  if (argv.includes('--ipc-type=node-worker')) {
    return NodeWorkerRpcClient.create({
      commandMap: CommandMap.commandMap,
    })
  }
  if (argv.includes('--ipc-type=node-forked-process')) {
    return NodeForkedProcessRpcClient.create({
      commandMap: CommandMap.commandMap,
    })
  }
  if (argv.includes('--ipc-type=electron-utility-process')) {
    return ElectronUtilityProcessRpcClient.create({
      commandMap: CommandMap.commandMap,
    })
  }
  throw new Error(`[file-system-process] unknown ipc type`)
}

export const initializeSharedProcessRpc = async (argv: readonly string[]): Promise<void> => {
  const rpc = await getRpc(argv)
  SharedProcess.set(rpc)
}
