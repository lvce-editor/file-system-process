// import { readFile, writeFile } from 'node:fs/promises'
// import { dirname, join } from 'node:path'
// import { fileURLToPath } from 'node:url'

// const __dirname = dirname(fileURLToPath(import.meta.url))

// const root = join(__dirname, '..', '..', '..')

// const nodeModulesPath = join(root, 'packages', 'server', 'node_modules')

// const searchProcessPath = join(root, 'packages', 'search-process', 'src', 'searchProcessMain.ts')

// const launchSearchProcessPath = join(
//   nodeModulesPath,
//   '@lvce-editor',
//   'shared-process',
//   'src',
//   'parts',
//   'LaunchSearchProcess',
//   'LaunchSearchProcess.js',
// )

// const old = await readFile(launchSearchProcessPath, 'utf8')
// const newContent = old
//   .replace('path: SearchProcessPath.searchProcessPath', `path: "${searchProcessPath}"`)
//   .replace('argv: []', 'argv: [], execArgv: ["--experimental-strip-types"]')

// await writeFile(launchSearchProcessPath, newContent)
