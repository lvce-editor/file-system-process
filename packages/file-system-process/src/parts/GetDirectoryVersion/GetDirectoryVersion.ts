import { randomUUID } from 'node:crypto'
import * as fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

// A process owns one filesystem connection. Never reuse a persisted listing
// against a different machine or a replacement connection with the same URI.
const namespace = randomUUID()
const timestampResolutionWindow = 2000

/** An opaque listing validator, or null when directory metadata is unsafe to cache. */
export const getDirectoryVersion = async (uri: string): Promise<string | null> => {
  const path = fileURLToPath(uri)
  const stats = await fs.stat(path, { bigint: true })
  if (!stats.isDirectory()) {
    return null
  }
  // Do not cache within a coarse filesystem timestamp tick. Both timestamps
  // matter: restoring mtime must not hide an entry change or directory replacement.
  const modified = Number(stats.mtimeNs / 1_000_000n)
  const changed = Number(stats.ctimeNs / 1_000_000n)
  if (Date.now() - Math.max(modified, changed) < timestampResolutionWindow) {
    return null
  }
  return `${namespace}:${stats.dev}:${stats.ino}:${stats.size}:${stats.mtimeNs}:${stats.ctimeNs}:${stats.birthtimeNs}`
}
