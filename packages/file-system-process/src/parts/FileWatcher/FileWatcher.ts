import * as fs from 'node:fs/promises'
import { assertUri } from '../AssertUri/AssertUri.ts'
import { fileURLToPath } from 'node:url'

const fileWacherEvents: Record<number, readonly any[]> = Object.create(null)

const setupWatcher = async (watcherId: number, uri: string, onChange: () => void): Promise<void> => {
  try {
    const path = fileURLToPath(uri)
    // TODO
    const watcher = fs.watch(path, {})
    const watcherEvents: any[] = []
    fileWacherEvents[watcherId] = watcherEvents
    for await (const event of watcher) {
      watcherEvents.push(event)
      onChange()
    }
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return
    }
    console.error(error)
  }
}

export const watchFile = async (watcherId: number, uri: string): Promise<void> => {
  assertUri(uri)
  fileWacherEvents[watcherId] = []
  // TODO await promise?
  const onChange = () => {
    // console.log('did change')
    // TODO send response via socket / messageport
  }
  setupWatcher(watcherId, uri, onChange)
}

export const unwatchFile = (uri: string): void => {
  // TODO
}

export const getEvents = (watcherId: number): readonly any[] => {
  return fileWacherEvents[watcherId] || []
}
