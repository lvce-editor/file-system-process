import { test, expect } from '@jest/globals'
import * as TrashElectron from '../src/parts/TrashElectron/TrashElectron.js'

test('trash is a function', () => {
  expect(typeof TrashElectron.trash).toBe('function')
})

test('trash returns early for non-existent path', async () => {
  await expect(TrashElectron.trash('/non/existent/path')).resolves.toBeUndefined()
})