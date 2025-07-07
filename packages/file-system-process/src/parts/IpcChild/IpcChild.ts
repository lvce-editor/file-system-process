import type { Rpc } from '@lvce-editor/rpc'
import * as IpcChildModule from '../IpcChildModule/IpcChildModule.ts'

export const listen = async ({ method, ...params }: { readonly method: number; readonly [key: string]: any }): Promise<Rpc> => {
  const create = IpcChildModule.getModule(method)
  const rpc = await create(params)
  return rpc
}
