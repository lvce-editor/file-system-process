import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { root } from './root.js'

const readJson = async (path) => {
  const content = await readFile(path, 'utf8')
  return JSON.parse(content)
}

export const getWsVersionFromLockfile = async () => {
  const lockfilePath = join(root, 'packages', 'file-system-process', 'package-lock.json')
  const lockfile = await readJson(lockfilePath)

  // ws is always installed as a dependency of @lvce-editor/rpc
  if (lockfile.packages && lockfile.packages['node_modules/ws'] && lockfile.packages['node_modules/ws'].version) {
    return `^${lockfile.packages['node_modules/ws'].version}`
  }

  throw new Error('Could not find ws version in package-lock.json. Make sure @lvce-editor/rpc is installed.')
}