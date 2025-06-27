import { mkdir, readFile, writeFile } from '../FileSystemDisk/FileSystemDisk.ts'
import * as Json from '../Json/Json.ts'
import * as Path from '../Path/Path.ts'

export const readJson = async (uri: string): Promise<any> => {
  const content = await readFile(uri)
  const json = await Json.parse(content, uri)
  return json
}

export const writeJson = async (uri: string, value: any): Promise<void> => {
  await mkdir(Path.dirname(uri))
  await writeFile(uri, Json.stringify(value))
}
