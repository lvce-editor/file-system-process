import { test, expect } from '@jest/globals'
import * as CreateMainProcessRpc from '../src/parts/InitializeMainProcessRpc/InitializeMainProcessRpc.ts'

test('createMainProcessRpc is a function', () => {
  expect(typeof CreateMainProcessRpc.initializeMainProcessRpc).toBe('function')
})
