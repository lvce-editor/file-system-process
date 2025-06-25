import { test, expect } from '@jest/globals'
import * as HandleIpc from '../src/parts/HandleIpc/HandleIpc.js'

test('handleIpc is a function', () => {
  expect(typeof HandleIpc.handleIpc).toBe('function')
})

test('unhandleIpc is a function', () => {
  expect(typeof (HandleIpc as any).unhandleIpc).toBe('function')
})
