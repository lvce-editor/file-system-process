import { test, expect } from '@jest/globals'
import type { ExitEvent } from '../src/parts/ExitEvent/ExitEvent.js'

test('ExitEvent interface has correct structure', () => {
  const exitEvent: ExitEvent = {
    event: {},
    type: 1,
  }
  expect(exitEvent.type).toBe(1)
  expect(exitEvent.event).toEqual({})
})
