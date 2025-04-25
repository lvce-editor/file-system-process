import * as FileSystemDisk from '../FileSystemDisk/FileSystemDisk.ts'

export const commandMap = {
  'FileSystem.chmod': FileSystemDisk.chmod,
  'FileSystem.copy': FileSystemDisk.copy,
  'FileSystem.getFolderSize': FileSystemDisk.getFolderSize,
  'FileSystem.getPathSeparator': FileSystemDisk.getPathSeparator,
  'FileSystem.mkdir': FileSystemDisk.mkdir,
  'FileSystem.readDirWithFileTypes': FileSystemDisk.readDirWithFileTypes,
  'FileSystem.readFile': FileSystemDisk.readFile,
  'FileSystem.readJson': FileSystemDisk.readJson,
  'FileSystem.remove': FileSystemDisk.remove,
  'FileSystem.rename': FileSystemDisk.rename,
  'FileSystem.stat': FileSystemDisk.stat,
  'FileSystem.writeFile': FileSystemDisk.writeFile,
}
