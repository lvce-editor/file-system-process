import { test, expect } from '@jest/globals'
import * as Listen from '../src/parts/Listen/Listen.js'

test('listen is a function', () => {
  expect(typeof Listen.listen).toBe('function')
})

test('listen throws error for invalid argv', async () => {
  await expect(Listen.listen([])).rejects.toThrow('[file-system-process] unknown ipc type')
})