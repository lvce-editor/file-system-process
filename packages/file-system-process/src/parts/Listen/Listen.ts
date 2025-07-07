import * as CommandMap from '../CommandMap/CommandMap.ts'
import * as IpcChild from '../IpcChild/IpcChild.ts'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'
import * as SharedProcess from '../SharedProcess/SharedProcess.ts'

export const listen = async (argv: readonly string[]): Promise<void> => {
  const rpc = await IpcChild.listen({
    method: IpcChildType.Auto(argv),
    commandMap: CommandMap.commandMap,
  })
  SharedProcess.set(rpc)
}
