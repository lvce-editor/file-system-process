import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as IsEnoentErrorWindows from '../IsEnoentErrorWindows/IsEnoentErrorWindows.ts'

// @ts-ignore
const isEnoentErrorLinux = (error: unknown): boolean => {
  return Boolean(error && (error as { code?: string }).code === ErrorCodes.ENOENT)
}

// @ts-ignore
export const isEnoentError = (error: unknown): boolean => {
  if (!error) {
    return false
  }
  return isEnoentErrorLinux(error) || IsEnoentErrorWindows.isEnoentErrorWindows(error)
}
