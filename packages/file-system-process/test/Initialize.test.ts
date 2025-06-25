import { test, expect } from '@jest/globals'
import * as Initialize from '../src/parts/Initialize/Initialize.js'

test('initialize is a function', () => {
  expect(typeof Initialize.initialize).toBe('function')
})

test('initialize throws error for invalid port', async () => {
  await expect(Initialize.initialize(null as any)).rejects.toThrow()
})
