import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import { VError } from '../VError/VError.ts'

// @ts-ignore
const getDisplayPath = (path) => {
  if (path === '') {
    return '<empty string>'
  }
  return path
}

export class FileNotFoundError extends VError {
  // @ts-ignore
  constructor(path) {
    super(`File not found: '${getDisplayPath(path)}'`)
    // @ts-ignore
    this.code = ErrorCodes.ENOENT
  }
}
