import * as fs from 'node:fs/promises'
import { join } from 'node:path'

interface FileHashCacheEntry {
  readonly fingerprint: string
  readonly hash: string
}

interface SerializedFileHashCache {
  readonly entries: readonly unknown[]
  readonly version: number
}

const cacheVersion = 1
const maxEntries = 50_000
const cacheFolderName = 'file-system-process'
const cacheFileName = 'file-hashes-v1.json'

const state: {
  cacheFilePath: string
  cacheFolderPath: string
  entries: Map<string, FileHashCacheEntry>
  loadPromise: Promise<void> | undefined
  persistedRevision: number
  revision: number
  writePromise: Promise<void> | undefined
} = {
  cacheFilePath: '',
  cacheFolderPath: '',
  entries: new Map(),
  loadPromise: undefined,
  persistedRevision: 0,
  revision: 0,
  writePromise: undefined,
}

const isSerializedCache = (value: unknown): value is SerializedFileHashCache => {
  if (!value || typeof value !== 'object') {
    return false
  }
  const candidate = value as Partial<SerializedFileHashCache>
  return candidate.version === cacheVersion && Array.isArray(candidate.entries)
}

const isSerializedEntry = (value: unknown): value is readonly [string, string, string] => {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    typeof value[0] === 'string' &&
    typeof value[1] === 'string' &&
    typeof value[2] === 'string' &&
    /^[\da-f]{64}$/.test(value[2])
  )
}

const parseCache = (content: string): readonly (readonly [string, string, string])[] | undefined => {
  const parsed: unknown = JSON.parse(content)
  if (!isSerializedCache(parsed) || !parsed.entries.every(isSerializedEntry)) {
    return undefined
  }
  return parsed.entries.slice(-maxEntries)
}

const load = async (): Promise<void> => {
  if (!state.cacheFilePath) {
    return
  }
  try {
    const content = await fs.readFile(state.cacheFilePath, 'utf8')
    const cachedEntries = parseCache(content)
    if (!cachedEntries) {
      return
    }
    for (const [path, fingerprint, hash] of cachedEntries) {
      state.entries.delete(path)
      state.entries.set(path, { fingerprint, hash })
    }
  } catch {
    // A persistent cache miss must fall back to hashing the source files.
  }
}

export const configure = (cacheDirectory?: string): void => {
  state.entries.clear()
  state.cacheFolderPath = cacheDirectory ? join(cacheDirectory, cacheFolderName) : ''
  state.cacheFilePath = state.cacheFolderPath ? join(state.cacheFolderPath, cacheFileName) : ''
  state.loadPromise = undefined
  state.persistedRevision = 0
  state.revision = 0
  state.writePromise = undefined
}

export const ensureLoaded = async (): Promise<void> => {
  state.loadPromise ||= load()
  await state.loadPromise
}

export const get = (path: string, fingerprint: string): string | undefined => {
  const entry = state.entries.get(path)
  if (!entry || entry.fingerprint !== fingerprint) {
    return undefined
  }
  state.entries.delete(path)
  state.entries.set(path, entry)
  return entry.hash
}

export const set = (path: string, fingerprint: string, hash: string): void => {
  const previous = state.entries.get(path)
  state.entries.delete(path)
  state.entries.set(path, { fingerprint, hash })
  if (!previous || previous.fingerprint !== fingerprint || previous.hash !== hash) {
    state.revision++
  }
  if (state.entries.size <= maxEntries) {
    return
  }
  const oldestPath = state.entries.keys().next().value
  if (oldestPath !== undefined) {
    state.entries.delete(oldestPath)
    state.revision++
  }
}

export const remove = (path: string): void => {
  if (state.entries.delete(path)) {
    state.revision++
  }
}

const serialize = (): string => {
  const serializedEntries = Array.from(state.entries, ([path, entry]) => [path, entry.fingerprint, entry.hash])
  return JSON.stringify({ entries: serializedEntries, version: cacheVersion })
}

const writeCurrentState = async (): Promise<void> => {
  while (state.cacheFilePath && state.persistedRevision !== state.revision) {
    const snapshotRevision = state.revision
    const temporaryPath = `${state.cacheFilePath}.${process.pid}.tmp`
    try {
      await fs.mkdir(state.cacheFolderPath, { recursive: true })
      await fs.writeFile(temporaryPath, serialize())
      await fs.rename(temporaryPath, state.cacheFilePath)
      state.persistedRevision = snapshotRevision
    } catch {
      try {
        await fs.rm(temporaryPath, { force: true })
      } catch {
        // Best-effort cleanup only.
      }
      return
    }
  }
}

export const flush = async (): Promise<void> => {
  await ensureLoaded()
  if (!state.cacheFilePath) {
    return
  }
  const writePromise = state.writePromise || writeCurrentState()
  state.writePromise = writePromise
  try {
    await writePromise
  } finally {
    if (state.writePromise === writePromise) {
      state.writePromise = undefined
    }
  }
}
