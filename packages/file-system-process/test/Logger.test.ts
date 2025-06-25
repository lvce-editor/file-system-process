import { test, expect } from '@jest/globals'
import * as Logger from '../src/parts/Logger/Logger.js'

test('info is a function', () => {
  expect(typeof Logger.info).toBe('function')
})

test('error is a function', () => {
  expect(typeof Logger.error).toBe('function')
})

test('info logs without throwing', () => {
  expect(() => Logger.info('test message')).not.toThrow()
})

test('error logs without throwing', () => {
  expect(() => Logger.error('test error')).not.toThrow()
})