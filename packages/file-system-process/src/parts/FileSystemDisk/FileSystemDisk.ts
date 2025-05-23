import type { Dirent, Mode } from 'node:fs'
// TODO lazyload chokidar and trash (but doesn't work currently because of bug with jest)
import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import { fileURLToPath } from 'node:url'
import * as Assert from '../Assert/Assert.ts'
import * as EncodingType from '../EncodingType/EncodingType.ts'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import { FileNotFoundError } from '../FileNotFoundError/FileNotFoundError.ts'
import * as GetDirentType from '../GetDirentType/GetDirentType.ts'
import * as GetFolderSizeInternal from '../GetFolderSizeInternal/GetFolderSizeInternal.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as Trash from '../Trash/Trash.ts'
import { VError } from '../VError/VError.ts'

const assertUri = (uri: string): void => {
  if (!uri.startsWith('file://')) {
    throw new Error(`path must be a valid file uri`)
  }
}

export const copy = async (sourceUri: string, targetUri: string): Promise<void> => {
  try {
    assertUri(sourceUri)
    assertUri(targetUri)
    const source = fileURLToPath(sourceUri)
    const target = fileURLToPath(targetUri)
    await fs.cp(source, target, { recursive: true })
  } catch (error) {
    if (
      error &&
      error.message &&
      error.message.startsWith('Invalid src or dest: cp returned EINVAL (src and dest cannot be the same)')
    ) {
      throw new VError(`Failed to copy "${sourceUri}" to "${targetUri}": src and dest cannot be the same`)
    }
    throw new VError(error, `Failed to copy "${sourceUri}" to "${targetUri}"`)
  }
}

export const readFile = async (uri: string, encoding: BufferEncoding = EncodingType.Utf8) => {
  try {
    Assert.string(uri)
    assertUri(uri)
    const path = fileURLToPath(uri)
    const content = await fs.readFile(path, encoding)
    return content
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      throw new FileNotFoundError(uri)
    }
    throw new VError(error, `Failed to read file "${uri}"`)
  }
}

export const writeFile = async (uri: string, content: string, encoding: BufferEncoding = EncodingType.Utf8) => {
  try {
    assertUri(uri)
    Assert.string(uri)
    Assert.string(content)
    const path = fileURLToPath(uri)
    // queue would be more correct for concurrent writes but also slower
    // Queue.add(`writeFile/${path}`, () =>
    await fs.writeFile(path, content, encoding)
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      throw new FileNotFoundError(uri)
    }
    throw new VError(error, `Failed to write to file "${uri}"`)
  }
}

const isOkayToRemove = (path: string): boolean => {
  if (path === '/') {
    return false
  }
  if (path === '~') {
    return false
  }
  if (path === os.homedir()) {
    return false
  }
  return true
}

export const remove = async (uri: string): Promise<void> => {
  assertUri(uri)
  const path = fileURLToPath(uri)
  if (!isOkayToRemove(path)) {
    console.warn('not removing path')
    return
  }

  // TODO lazyload trash (doesn't work currently because of bug with jest)
  // const { trash } = await import('../../wrap/trash.js')
  try {
    await Trash.trash(path)
  } catch (error) {
    throw new VError(error, `Failed to remove "${uri}"`)
  }
}

export const forceRemove = async (uri: string): Promise<void> => {
  assertUri(uri)
  const path = fileURLToPath(uri)
  if (!isOkayToRemove(path)) {
    console.warn('not removing path')
    return
  }
  try {
    await fs.rm(path, { force: true, recursive: true })
  } catch (error) {
    throw new VError(error, `Failed to remove "${uri}"`)
  }
}

export const exists = async (uri: string): Promise<boolean> => {
  try {
    assertUri(uri)
    // @ts-ignore
    const path = fileURLToPath(uri)
    await fs.access(uri)
    return true
  } catch {
    return false
  }
}

const toPrettyDirent = (dirent: Dirent): any => {
  return {
    name: dirent.name,
    type: GetDirentType.getDirentType(dirent),
  }
}

export const readDirWithFileTypes = async (uri: string): Promise<readonly any[]> => {
  try {
    assertUri(uri)
    const path = fileURLToPath(uri)
    const dirents = await fs.readdir(path, { withFileTypes: true })
    const prettyDirents = dirents.map(toPrettyDirent)
    return prettyDirents
  } catch (error) {
    throw new VError(error, `Failed to read directory "${uri}"`)
  }
}

export const readDir = async (uri: string): Promise<readonly string[]> => {
  try {
    const path = fileURLToPath(uri)
    const dirents = await fs.readdir(path)
    return dirents
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      throw new FileNotFoundError(uri)
    }
    throw new VError(error, `Failed to read directory "${uri}"`)
  }
}

export const mkdir = async (uri: string): Promise<void> => {
  try {
    assertUri(uri)
    const path = fileURLToPath(uri)
    await fs.mkdir(path, { recursive: true })
  } catch (error) {
    throw new VError(error, `Failed to create directory "${uri}"`)
  }
}

const fallbackRename = async (oldUri: string, newUri: string): Promise<void> => {
  try {
    const oldPath = fileURLToPath(oldUri)
    const newPath = fileURLToPath(newUri)
    await fs.cp(oldPath, newPath, { recursive: true })
    await fs.rm(oldPath, { recursive: true })
  } catch (error) {
    throw new VError(error, `Failed to rename "${oldUri}" to "${newUri}"`)
  }
}

export const rename = async (oldUri: string, newUri: string): Promise<void> => {
  try {
    const oldPath = fileURLToPath(oldUri)
    const newPath = fileURLToPath(newUri)
    await fs.rename(oldPath, newPath)
  } catch (error) {
    if (error && error.code === ErrorCodes.EXDEV) {
      return fallbackRename(oldUri, newUri)
    }
    throw new VError(error, `Failed to rename "${oldUri}" to "${newUri}"`)
  }
}

export const getPathSeparator = (): string => {
  return '/'
}

export const stat = async (uri: string): Promise<number> => {
  const path = fileURLToPath(uri)
  const stats = await fs.stat(path)
  const type = GetDirentType.getDirentType(stats)
  return type
}

export const chmod = async (uri: string, permissions: Mode): Promise<void> => {
  const path = fileURLToPath(uri)
  await fs.chmod(path, permissions)
}

export const copyFile = async (fromUri: string, toUri: string): Promise<void> => {
  try {
    const fromPath = fileURLToPath(fromUri)
    const toPath = fileURLToPath(toUri)
    await fs.copyFile(fromPath, toPath)
  } catch (error) {
    throw new VError(error, `Failed to copy file from ${fromUri} to ${toUri}`)
  }
}

export const cp = async (fromUri: string, toUri: string): Promise<void> => {
  try {
    const fromPath = fileURLToPath(fromUri)
    const toPath = fileURLToPath(toUri)
    await fs.cp(fromPath, toPath, { recursive: true })
  } catch (error) {
    throw new VError(error, `Failed to copy folder from ${fromUri} to ${toUri}`)
  }
}

export const readJson = async (uri: string): Promise<any> => {
  try {
    Assert.string(uri)
    assertUri(uri)
    const path = fileURLToPath(uri)
    const content = await fs.readFile(path, 'utf8')
    const parsed = JSON.parse(content)
    return parsed
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      throw new FileNotFoundError(uri)
    }
    throw new VError(error, `Failed to read file as json "${uri}"`)
  }
}

export const getFolderSize = async (uri: string): Promise<number> => {
  const path = fileURLToPath(uri)
  const total = await GetFolderSizeInternal.getFolderSizeInternal(path)
  return total
}
