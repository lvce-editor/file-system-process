import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as JsonFile from '../JsonFile/JsonFile.ts'
import { VError } from '../VError/VError.ts'

export const getRecentlyOpened = async (recentlyOpenedPath: string): Promise<readonly string[]> => {
  try {
    const parsed = await JsonFile.readJson(recentlyOpenedPath)
    return parsed
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      // ignore
    } else if (error && error.code === ErrorCodes.E_JSON_PARSE) {
      // ignore
    } else {
      throw new VError(error, `Failed to read recently opened`)
    }
    return []
  }
}
