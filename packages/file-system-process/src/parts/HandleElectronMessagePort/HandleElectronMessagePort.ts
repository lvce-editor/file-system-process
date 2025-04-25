import * as Assert from '../Assert/Assert.ts'
import * as IpcChild from '../IpcChild/IpcChild.ts'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'

export const handleElectronMessagePort = async (messagePort: any, ...params: readonly any[]): Promise<void> => {
  Assert.object(messagePort)
  await IpcChild.listen({
    method: IpcChildType.ElectronMessagePort,
    messagePort,
  })
}
