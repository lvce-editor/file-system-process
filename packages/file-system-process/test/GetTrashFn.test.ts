import { test, expect } from '@jest/globals'
import * as GetTrashFn from '../src/parts/GetTrashFn/GetTrashFn.js'

test('getTrashFn returns function for electron', () => {
  const result = GetTrashFn.getTrashFn(true)
  expect(typeof result).toBe('function')
})

test('getTrashFn returns function for node', () => {
  const result = GetTrashFn.getTrashFn(false)
  expect(typeof result).toBe('function')
})
