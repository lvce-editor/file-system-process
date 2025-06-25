// @ts-ignore
export const isEnoentErrorWindows = (error) => {
  if (!error || !error.message) {
    return false
  }
  return error.message.includes('The system cannot find the path specified.')
}
