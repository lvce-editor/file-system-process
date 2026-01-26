import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as IsEnoentErrorWindows from '../IsEnoentErrorWindows/IsEnoentErrorWindows.ts'

const isEnoentErrorLinux = (error: unknown): boolean => {
  return Boolean(error && (error as { code?: string }).code === ErrorCodes.ENOENT)
}

export const isEnoentError = (error: unknown): boolean => {
  if (!error) {
    return false
  }
  return isEnoentErrorLinux(error) || IsEnoentErrorWindows.isEnoentErrorWindows(error)
}
