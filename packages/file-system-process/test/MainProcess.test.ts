import { test, expect } from '@jest/globals'
import * as MainProcess from '../src/parts/MainProcess/MainProcess.ts'

test('MainProcess exports invoke function', () => {
  expect(typeof MainProcess.invoke).toBe('function')
})

test('MainProcess exports invokeAndTransfer function', () => {
  expect(typeof MainProcess.invokeAndTransfer).toBe('function')
})

test('MainProcess exports set function', () => {
  expect(typeof MainProcess.set).toBe('function')
})
