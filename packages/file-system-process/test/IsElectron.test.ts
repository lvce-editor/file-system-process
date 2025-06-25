import { test, expect } from '@jest/globals'
import * as IsElectron from '../src/parts/IsElectron/IsElectron.js'

test('isElectron returns boolean', () => {
  const result = IsElectron.isElectron
  expect(typeof result).toBe('boolean')
})