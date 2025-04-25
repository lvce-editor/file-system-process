import { test, expect, jest } from '@jest/globals'

const mockResult = {
  stdout: 'test output',
  stderr: '',
}

jest.unstable_mockModule('execa', () => ({
  execa: jest.fn().mockImplementation(() => Promise.resolve(mockResult)),
}))

const { execa } = await import('execa')

test('exec - should execute command and return stdout and stderr', async () => {
  const { exec } = await import('../src/parts/Exec/Exec.js')
  const result = await exec('echo', ['hello'], {})
  expect(result).toEqual(mockResult)
  expect(execa).toHaveBeenCalledWith('echo', ['hello'], {})
})

test('exec - should throw if command is not a string', async () => {
  const { exec } = await import('../src/parts/Exec/Exec.js')
  await expect(exec(123 as any, [], {})).rejects.toThrow()
})

test('exec - should throw if args is not an array', async () => {
  const { exec } = await import('../src/parts/Exec/Exec.js')
  await expect(exec('echo', 'not-an-array' as any, {})).rejects.toThrow()
})

test('exec - should throw if options is not an object', async () => {
  const { exec } = await import('../src/parts/Exec/Exec.js')
  await expect(exec('echo', [], 'not-an-object' as any)).rejects.toThrow()
})
