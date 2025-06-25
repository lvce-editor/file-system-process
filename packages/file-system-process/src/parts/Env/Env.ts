export const getElectronRunAsNode = (): string => {
  return process.env.ELECTRON_RUN_AS_NODE || ''
}
