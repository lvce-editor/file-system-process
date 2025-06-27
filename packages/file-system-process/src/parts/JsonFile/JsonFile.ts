import { mkdir, readFile, writeFile } from '../FileSystemDisk/FileSystemDisk.ts'
import * as Json from '../Json/Json.js'
import * as Path from '../Path/Path.js'

export const readJson = async (absolutePath: string): Promise<any> => {
  const content = await readFile(absolutePath)
  const json = await Json.parse(content, absolutePath)
  return json
}

export const writeJson = async (absolutePath: string, value: any): Promise<void> => {
  await mkdir(Path.dirname(absolutePath))
  await writeFile(absolutePath, Json.stringify(value))
}
