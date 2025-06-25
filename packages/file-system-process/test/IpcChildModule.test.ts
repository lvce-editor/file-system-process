import { test, expect } from '@jest/globals'
import * as IpcChildModule from '../src/parts/IpcChildModule/IpcChildModule.js'
import * as IpcChildType from '../src/parts/IpcChildType/IpcChildType.js'

test('getModule returns function for valid method', () => {
  const result = IpcChildModule.getModule(IpcChildType.NodeWorker)
  expect(typeof result).toBe('function')
})

test('getModule returns function for NodeForkedProcess', () => {
  const result = IpcChildModule.getModule(IpcChildType.NodeForkedProcess)
  expect(typeof result).toBe('function')
})

test('getModule returns function for ElectronUtilityProcess', () => {
  const result = IpcChildModule.getModule(IpcChildType.ElectronUtilityProcess)
  expect(typeof result).toBe('function')
})

test('getModule returns function for ElectronMessagePort', () => {
  const result = IpcChildModule.getModule(IpcChildType.ElectronMessagePort)
  expect(typeof result).toBe('function')
})

test('getModule returns function for WebSocket', () => {
  const result = IpcChildModule.getModule(IpcChildType.WebSocket)
  expect(typeof result).toBe('function')
})

test('getModule throws error for invalid method', () => {
  expect(() => IpcChildModule.getModule(999)).toThrow('unexpected ipc type')
})
