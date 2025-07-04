import { test, expect } from '@jest/globals'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.ts'
import * as IsEnoentError from '../src/parts/IsEnoentError/IsEnoentError.ts'

test('isEnoentError returns false for null', () => {
  const result = IsEnoentError.isEnoentError(null)
  expect(result).toBe(false)
})

test('isEnoentError returns false for undefined', () => {
  const result = IsEnoentError.isEnoentError(undefined)
  expect(result).toBe(false)
})

test('isEnoentError returns true for ENOENT error', () => {
  const error = { code: ErrorCodes.ENOENT }
  const result = IsEnoentError.isEnoentError(error)
  expect(result).toBe(true)
})

test('isEnoentError returns false for non-ENOENT error', () => {
  const error = { code: 'OTHER_ERROR' }
  const result = IsEnoentError.isEnoentError(error)
  expect(result).toBe(false)
})
