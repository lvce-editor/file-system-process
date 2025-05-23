import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import { VError } from '../VError/VError.ts'

const getDisplayPath = (path: string): string => {
  if (path === '') {
    return '<empty string>'
  }
  return path
}

export class FileNotFoundError extends VError {
  code: string

  constructor(path: string) {
    super(`File not found: '${getDisplayPath(path)}'`)
    this.code = ErrorCodes.ENOENT
  }
}
