import { initializeMainProcessRpc } from '../InitializeMainProcessRpc/InitializeMainProcessRpc.ts'
import { initializeParentProcessRpc } from '../InitializeSharedProcessRpc/InitializeSharedProcessRpc.ts'

export const listen = async (argv: readonly string[]): Promise<void> => {
  await Promise.all([initializeParentProcessRpc(argv), initializeMainProcessRpc()])
}
