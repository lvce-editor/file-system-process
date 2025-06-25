import { test, expect } from '@jest/globals'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.js'
import { FileNotFoundError } from '../src/parts/FileNotFoundError/FileNotFoundError.js'

test('FileNotFoundError extends VError', () => {
  const error = new FileNotFoundError('/test/path')
  expect(error).toBeInstanceOf(Error)
  expect(error.message).toContain('File not found')
})

test('FileNotFoundError has correct code', () => {
  const error = new FileNotFoundError('/test/path')
  expect(error.code).toBe(ErrorCodes.ENOENT)
})

test('FileNotFoundError handles empty path', () => {
  const error = new FileNotFoundError('')
  expect(error.message).toContain('<empty string>')
})

test('FileNotFoundError handles normal path', () => {
  const error = new FileNotFoundError('/test/path')
  expect(error.message).toContain('/test/path')
})