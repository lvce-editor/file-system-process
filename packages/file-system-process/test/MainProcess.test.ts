import { test, expect } from '@jest/globals'
import { MainProcess } from '@lvce-editor/rpc-registry'

test('MainProcess exports invoke function', () => {
  expect(typeof MainProcess.invoke).toBe('function')
})

test('MainProcess exports set function', () => {
  expect(typeof MainProcess.set).toBe('function')
})
