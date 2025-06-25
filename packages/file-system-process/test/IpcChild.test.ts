import { test, expect } from '@jest/globals'
import * as IpcChild from '../src/parts/IpcChild/IpcChild.js'

test('listen is a function', () => {
  expect(typeof IpcChild.listen).toBe('function')
})

test('listen throws error for invalid method', async () => {
  await expect(IpcChild.listen({ method: 999, other: 'params' })).rejects.toThrow('unexpected ipc type')
})
