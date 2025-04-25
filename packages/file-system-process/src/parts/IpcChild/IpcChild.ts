import * as IpcChildModule from '../IpcChildModule/IpcChildModule.ts'

export const listen = async ({ method, ...params }: { readonly method: number; readonly [key: string]: any }): Promise<any> => {
  const module = IpcChildModule.getModule(method)
  const rpc = await module.create(params)
  return rpc
}
