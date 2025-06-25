import { test, expect } from '@jest/globals'
import * as Env from '../src/parts/Env/Env.js'

test('getElectronRunAsNode returns environment variable', () => {
  const result = Env.getElectronRunAsNode()
  expect(typeof result).toBe('string')
})