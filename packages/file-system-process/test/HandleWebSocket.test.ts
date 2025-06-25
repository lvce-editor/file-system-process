import { test, expect } from '@jest/globals'
import * as HandleWebSocket from '../src/parts/HandleWebSocket/HandleWebSocket.js'

test('handleWebSocket is a function', () => {
  expect(typeof HandleWebSocket.handleWebSocket).toBe('function')
})

test('handleWebSocket throws error for invalid handle', async () => {
  await expect(HandleWebSocket.handleWebSocket(null, {})).rejects.toThrow()
})

test('handleWebSocket throws error for invalid request', async () => {
  await expect(HandleWebSocket.handleWebSocket({}, null)).rejects.toThrow()
})
