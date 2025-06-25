import { test, expect } from '@jest/globals'
import * as TrashNode from '../src/parts/TrashNode/TrashNode.js'

test('trash is a function', () => {
  expect(typeof TrashNode.trash).toBe('function')
})
