import { test, expect } from '@jest/globals'
import * as CreateMainProcessRpc from '../src/parts/CreateMainProcessRpc/CreateMainProcessRpc.js'

test('createMainProcessRpc is a function', () => {
  expect(typeof CreateMainProcessRpc.createMainProcessRpc).toBe('function')
})

test('createMainProcessRpc throws error for invalid port', async () => {
  await expect(CreateMainProcessRpc.createMainProcessRpc(null as any)).rejects.toThrow()
})