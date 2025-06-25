import { test, expect } from '@jest/globals'
import * as HandleElectronMessagePort from '../src/parts/HandleElectronMessagePort/HandleElectronMessagePort.js'

test('handleElectronMessagePort is a function', () => {
  expect(typeof HandleElectronMessagePort.handleElectronMessagePort).toBe('function')
})

test('handleElectronMessagePort throws error for invalid messagePort', async () => {
  await expect(HandleElectronMessagePort.handleElectronMessagePort(null, 'param1')).rejects.toThrow()
})
