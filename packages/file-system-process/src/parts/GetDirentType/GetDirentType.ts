import type { Dirent, StatsBase } from 'node:fs'
import * as DirentType from '../DirentType/DirentType.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const getDirentType = (dirent: Dirent | StatsBase<number>): number => {
  if (dirent.isFile()) {
    return DirentType.File
  }
  if (dirent.isDirectory()) {
    return DirentType.Directory
  }
  if (dirent.isSymbolicLink()) {
    return DirentType.Symlink
  }
  if (dirent.isSocket()) {
    return DirentType.Socket
  }
  if (dirent.isBlockDevice()) {
    return DirentType.BlockDevice
  }
  if (dirent.isCharacterDevice()) {
    return DirentType.CharacterDevice
  }
  if (dirent.isFIFO()) {
    return DirentType.Fifo
  }
  return DirentType.Unknown
}
