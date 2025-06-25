import { test, expect } from '@jest/globals'
import * as ProcessExitEventType from '../src/parts/ProcessExitEventType/ProcessExitEventType.js'

test('ProcessExitEventType constants have correct values', () => {
  expect(ProcessExitEventType.Error).toBe(1)
  expect(ProcessExitEventType.Exit).toBe(2)
})