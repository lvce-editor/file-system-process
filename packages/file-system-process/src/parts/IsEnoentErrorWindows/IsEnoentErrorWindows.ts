// @ts-ignore
export const isEnoentErrorWindows = (error: unknown): boolean => {
  if (!error || !(error as { message?: string }).message) {
    return false
  }
  return (error as { message: string }).message.includes('The system cannot find the path specified.')
}
