import * as CreateMainProcessRpc from '../CreateMainProcessRpc/CreateMainProcessRpc.ts'
import * as MainProcess from '../MainProcess/MainProcess.ts'

export const initialize = async (): Promise<void> => {
  MainProcess.setFactory(CreateMainProcessRpc.createMainProcessRpc)
}
