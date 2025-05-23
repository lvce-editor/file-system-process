import * as IpcChildModule from '../IpcChildModule/IpcChildModule.ts'

export const listen = async ({ method, ...params }: { readonly method: number; readonly [key: string]: any }): Promise<any> => {
  const create = IpcChildModule.getModule(method)
  const rpc = await create(params)
  return rpc
}
