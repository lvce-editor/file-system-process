import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcChild from '../IpcChild/IpcChild.ts'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

// TODO add tests for this

// TODO handle structure: one shared process multiple extension hosts

// TODO pass socket / port handle also in electron

export const state = {
  electronPortMap: new Map(),
  ipc: undefined,
}

// TODO maybe rename to hydrate
export const listen = async () => {
  // @ts-ignore
  const method = IpcChildType.Auto()
  const ipc = await IpcChild.listen({
    method,
  })
  HandleIpc.handleIpc(ipc)
  // @ts-ignore
  state.ipc = ipc
}

// @ts-ignore
export const invoke = (method, ...params: readonly any[]) => {
  return JsonRpc.invoke(state.ipc, method, ...params)
}
// @ts-ignore
export const invokeAndTransfer = (method, ...params: readonly any[]) => {
  return JsonRpc.invokeAndTransfer(state.ipc, method, ...params)
}
