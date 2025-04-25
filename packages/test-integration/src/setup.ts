import { afterEach } from '@jest/globals'
import { NodeForkedProcessRpcParent, Rpc } from '@lvce-editor/rpc'
import { mkdir } from 'fs/promises'
import { randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..', '..', '..')
const fileSystemProcessPath = join(root, 'packages', 'file-system-process-process', 'src', 'fileSystemProcessMain.ts')

const rpcs: Rpc[] = []

// TODO use symbol.asyncDispose once available
afterEach(async () => {
  for (const rpc of rpcs) {
    await rpc.dispose()
  }
  rpcs.length = 0
})

export const setup = async () => {
  const id = randomUUID()
  const testDir = join(root, '.tmp', 'test-dir', `test-${id}`)
  await mkdir(testDir, { recursive: true })

  const rpc = await NodeForkedProcessRpcParent.create({
    execArgv: ['--experimental-strip-types'],
    commandMap: {},
    path: fileSystemProcessPath,
  })

  rpcs.push(rpc)

  return {
    testDir,
    rpc,
    async setFiles(fileMap: Record<string, string>) {
      for (const [key, value] of Object.entries(fileMap)) {
        const absolutePath = join(testDir, key)
        await writeFile(absolutePath, value)
      }
    },
    dispose() {},
  }
}
