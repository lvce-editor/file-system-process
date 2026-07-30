import { VError } from '@lvce-editor/verror'
import * as fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { assertUri } from '../AssertUri/AssertUri.ts'

const setupWatcher = async (watcherId: number, uri: string, onChange: () => void): Promise<void> => {
  try {
    const path = fileURLToPath(uri)
    // TODO
    const watcher = fs.watch(path, {})
    for await (const _event of watcher) {
      onChange()
    }
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return
    }
    console.error(new VError(error, `Failed to setup watcher for ${uri}`))
  }
}

// TODO when socket closes, dispose file watcher for this socket
export const watchFile = async (socket: any, watcherId: number, uri: string): Promise<void> => {
  assertUri(uri)
  // TODO await promise?
  const onChange = (): void => {
    // TODO handle error
    socket.send({
      jsonrpc: '2.0',
      method: 'FileSystem.executeWatchCallback',
      params: [watcherId],
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  setupWatcher(watcherId, uri, onChange)
}

export const unwatchFile = (uri: string): void => {
  // TODO
}
