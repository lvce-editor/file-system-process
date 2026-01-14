import * as CreateMainProcessRpc from '../CreateMainProcessRpc/CreateMainProcessRpc.ts'

export const initialize = async (): Promise<void> => {
  await CreateMainProcessRpc.createMainProcessRpc()
}
