import { createLazyRpc, MainProcess, RpcId } from '@lvce-editor/rpc-registry'

export const { set } = MainProcess

export const { invoke, setFactory } = createLazyRpc(RpcId.MainProcess)
