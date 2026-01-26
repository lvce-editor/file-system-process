import { initializeMainProcessRpc } from '../InitializeMainProcessRpc/InitializeMainProcessRpc.ts'
import { initializeSharedProcessRpc } from '../InitializeSharedProcessRpc/InitializeSharedProcessRpc.ts'

export const listen = async (argv: readonly string[]): Promise<void> => {
  await Promise.all([initializeSharedProcessRpc(argv), initializeMainProcessRpc()])
}
