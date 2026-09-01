import { expect, jest, test } from '@jest/globals'

const mockConfigure = jest.fn()

jest.unstable_mockModule('../src/parts/FileHashCache/FileHashCache.js', () => ({
  configure: mockConfigure,
}))

const Initialize = await import('../src/parts/Initialize/Initialize.js')

test('initialize is a function', () => {
  expect(typeof Initialize.initialize).toBe('function')
})

test('initialize configures the persistent file hash cache', async () => {
  mockConfigure.mockClear()

  await Initialize.initialize('/cache/lvce')

  expect(mockConfigure).toHaveBeenCalledWith('/cache/lvce')
})

test('initialize keeps persistence optional for older callers', async () => {
  mockConfigure.mockClear()

  await Initialize.initialize()

  expect(mockConfigure).toHaveBeenCalledWith(undefined)
})
