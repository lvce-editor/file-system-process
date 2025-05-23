import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

// TODO add tests for this

// TODO handle structure: one shared process multiple extension hosts

// TODO pass socket / port handle also in electron

const state = {
  electronPortMap: new Map(),
  ipc: undefined,
}

export const invoke = (method: string, ...params: readonly any[]) => {
  return JsonRpc.invoke(state.ipc, method, ...params)
}
