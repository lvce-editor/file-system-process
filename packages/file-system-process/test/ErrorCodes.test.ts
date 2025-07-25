import { test, expect } from '@jest/globals'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.js'

test('ErrorCodes constants have correct values', () => {
  expect(ErrorCodes.ENOENT).toBe('ENOENT')
  expect(ErrorCodes.EXDEV).toBe('EXDEV')
})
