import { test, expect } from '@jest/globals'
import * as CommandMap from '../src/parts/CommandMap/CommandMap.js'

test('commandMap contains expected commands', () => {
  expect(typeof CommandMap.commandMap).toBe('object')
  expect(typeof CommandMap.commandMap['FileSystem.chmod']).toBe('function')
  expect(typeof CommandMap.commandMap['FileSystem.copy']).toBe('function')
  expect(typeof CommandMap.commandMap['FileSystem.getFolderSize']).toBe('function')
  expect(typeof CommandMap.commandMap['FileSystem.getPathSeparator']).toBe('function')
  expect(typeof CommandMap.commandMap['FileSystem.mkdir']).toBe('function')
  expect(typeof CommandMap.commandMap['FileSystem.readDirWithFileTypes']).toBe('function')
  expect(typeof CommandMap.commandMap['FileSystem.readFile']).toBe('function')
  expect(typeof CommandMap.commandMap['FileSystem.readJson']).toBe('function')
  expect(typeof CommandMap.commandMap['FileSystem.remove']).toBe('function')
  expect(typeof CommandMap.commandMap['FileSystem.rename']).toBe('function')
  expect(typeof CommandMap.commandMap['FileSystem.stat']).toBe('function')
  expect(typeof CommandMap.commandMap['FileSystem.writeFile']).toBe('function')
  expect(typeof CommandMap.commandMap['HandleElectronMessagePort.handleElectronMessagePort']).toBe('function')
  expect(typeof CommandMap.commandMap['HandleWebSocket.handleWebSocket']).toBe('function')
  expect(typeof CommandMap.commandMap['Initialize.initialize']).toBe('function')
})
