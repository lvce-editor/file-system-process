import { test, expect } from '@jest/globals'
import * as IsEnoentErrorWindows from '../src/parts/IsEnoentErrorWindows/IsEnoentErrorWindows.js'

test('isEnoentErrorWindows returns true for Windows path error', () => {
  const error = { message: 'The system cannot find the path specified.' }
  const result = IsEnoentErrorWindows.isEnoentErrorWindows(error)
  expect(result).toBe(true)
})

test('isEnoentErrorWindows returns false for other error', () => {
  const error = { message: 'Some other error' }
  const result = IsEnoentErrorWindows.isEnoentErrorWindows(error)
  expect(result).toBe(false)
})

test('isEnoentErrorWindows returns false for error without message', () => {
  const error = {}
  const result = IsEnoentErrorWindows.isEnoentErrorWindows(error)
  expect(result).toBe(false)
})

test('isEnoentErrorWindows returns false for null', () => {
  const result = IsEnoentErrorWindows.isEnoentErrorWindows(null)
  expect(result).toBe(false)
})