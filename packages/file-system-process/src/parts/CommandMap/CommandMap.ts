import * as AddRecentlyOpenedPath from '../AddRecentlyOpenedPath/AddRecentlyOpenedPath.ts'
import * as FileSystemDisk from '../FileSystemDisk/FileSystemDisk.ts'
import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.ts'
import * as HandleWebSocket from '../HandleWebSocket/HandleWebSocket.ts'
import * as Initialize from '../Initialize/Initialize.ts'
import * as TemporaryMessagePort from '../TemporaryMessagePort/TemporaryMessagePort.ts'

export const commandMap = {
  'FileSystem.addRecentlyOpenedPath': AddRecentlyOpenedPath.addRecentlyOpenedPath,
  'FileSystem.chmod': FileSystemDisk.chmod,
  'FileSystem.copy': FileSystemDisk.copy,
  'FileSystem.exists': FileSystemDisk.exists,
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
  'HandleElectronMessagePort.handleElectronMessagePort': HandleElectronMessagePort.handleElectronMessagePort,
  'HandleWebSocket.handleWebSocket': HandleWebSocket.handleWebSocket,
  'Initialize.initialize': Initialize.initialize,
  'TemporaryMessagePort.handlePorts': TemporaryMessagePort.handlePorts,
}
