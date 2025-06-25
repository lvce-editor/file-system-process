import { test, expect } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'

test('DirentType constants have correct values', () => {
  expect(DirentType.BlockDevice).toBe(1)
  expect(DirentType.CharacterDevice).toBe(2)
  expect(DirentType.Directory).toBe(3)
  expect(DirentType.Fifo).toBe(6)
  expect(DirentType.File).toBe(7)
  expect(DirentType.Socket).toBe(8)
  expect(DirentType.Symlink).toBe(9)
  expect(DirentType.Unknown).toBe(12)
})