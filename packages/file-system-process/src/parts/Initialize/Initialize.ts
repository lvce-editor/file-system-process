import * as CreateMainProcessRpc from '../InitializeMainProcessRpc/InitializeMainProcessRpc.ts'

export const initialize = async (): Promise<void> => {
  await CreateMainProcessRpc.initializeMainProcessRpc()
}
