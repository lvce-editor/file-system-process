import { test, expect } from '@jest/globals'
import * as Assert from '../src/parts/Assert/Assert.ts'

test('Assert exports from @lvce-editor/assert', () => {
  expect(typeof Assert).toBe('object')
})
