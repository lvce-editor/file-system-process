import { test, expect } from '@jest/globals'
import * as CreateMainProcessRpc from '../src/parts/CreateMainProcessRpc/CreateMainProcessRpc.js'

test('createMainProcessRpc is a function', () => {
  expect(typeof CreateMainProcessRpc.createMainProcessRpc).toBe('function')
})
