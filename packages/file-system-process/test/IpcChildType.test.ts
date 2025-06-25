import { test, expect } from '@jest/globals'
import * as IpcChildType from '../src/parts/IpcChildType/IpcChildType.js'

test('IpcChildType constants have correct values', () => {
  expect(IpcChildType.NodeWorker).toBe(1)
  expect(IpcChildType.NodeForkedProcess).toBe(2)
  expect(IpcChildType.ElectronUtilityProcess).toBe(3)
  expect(IpcChildType.ElectronMessagePort).toBe(4)
  expect(IpcChildType.WebSocket).toBe(6)
})

test('Auto returns NodeWorker for node-worker flag', () => {
  const result = IpcChildType.Auto(['--ipc-type=node-worker'])
  expect(result).toBe(IpcChildType.NodeWorker)
})

test('Auto returns NodeForkedProcess for node-forked-process flag', () => {
  const result = IpcChildType.Auto(['--ipc-type=node-forked-process'])
  expect(result).toBe(IpcChildType.NodeForkedProcess)
})

test('Auto returns ElectronUtilityProcess for electron-utility-process flag', () => {
  const result = IpcChildType.Auto(['--ipc-type=electron-utility-process'])
  expect(result).toBe(IpcChildType.ElectronUtilityProcess)
})

test('Auto throws error for unknown ipc type', () => {
  expect(() => IpcChildType.Auto(['--ipc-type=unknown'])).toThrow('[file-system-process] unknown ipc type')
})
