import { test, expect } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as GetDirentType from '../src/parts/GetDirentType/GetDirentType.js'

test('getDirentType returns correct type for file', (): void => {
  const mockDirent = {
    isBlockDevice: (): boolean => false,
    isCharacterDevice: (): boolean => false,
    isDirectory: (): boolean => false,
    isFIFO: (): boolean => false,
    isFile: (): boolean => true,
    isSocket: (): boolean => false,
    isSymbolicLink: (): boolean => false,
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.File)
})

test('getDirentType returns correct type for directory', (): void => {
  const mockDirent = {
    isBlockDevice: (): boolean => false,
    isCharacterDevice: (): boolean => false,
    isDirectory: (): boolean => true,
    isFIFO: (): boolean => false,
    isFile: (): boolean => false,
    isSocket: (): boolean => false,
    isSymbolicLink: (): boolean => false,
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.Directory)
})

test('getDirentType returns correct type for symlink', (): void => {
  const mockDirent = {
    isBlockDevice: (): boolean => false,
    isCharacterDevice: (): boolean => false,
    isDirectory: (): boolean => false,
    isFIFO: (): boolean => false,
    isFile: (): boolean => false,
    isSocket: (): boolean => false,
    isSymbolicLink: (): boolean => true,
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.Symlink)
})

test('getDirentType returns correct type for socket', (): void => {
  const mockDirent = {
    isBlockDevice: (): boolean => false,
    isCharacterDevice: (): boolean => false,
    isDirectory: (): boolean => false,
    isFIFO: (): boolean => false,
    isFile: (): boolean => false,
    isSocket: (): boolean => true,
    isSymbolicLink: (): boolean => false,
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.Socket)
})

test('getDirentType returns correct type for block device', (): void => {
  const mockDirent = {
    isBlockDevice: (): boolean => true,
    isCharacterDevice: (): boolean => false,
    isDirectory: (): boolean => false,
    isFIFO: (): boolean => false,
    isFile: (): boolean => false,
    isSocket: (): boolean => false,
    isSymbolicLink: (): boolean => false,
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.BlockDevice)
})

test('getDirentType returns correct type for character device', (): void => {
  const mockDirent = {
    isBlockDevice: (): boolean => false,
    isCharacterDevice: (): boolean => true,
    isDirectory: (): boolean => false,
    isFIFO: (): boolean => false,
    isFile: (): boolean => false,
    isSocket: (): boolean => false,
    isSymbolicLink: (): boolean => false,
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.CharacterDevice)
})

test('getDirentType returns correct type for fifo', (): void => {
  const mockDirent = {
    isBlockDevice: (): boolean => false,
    isCharacterDevice: (): boolean => false,
    isDirectory: (): boolean => false,
    isFIFO: (): boolean => true,
    isFile: (): boolean => false,
    isSocket: (): boolean => false,
    isSymbolicLink: (): boolean => false,
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.Fifo)
})

test('getDirentType returns unknown for unrecognized type', (): void => {
  const mockDirent = {
    isBlockDevice: (): boolean => false,
    isCharacterDevice: (): boolean => false,
    isDirectory: (): boolean => false,
    isFIFO: (): boolean => false,
    isFile: (): boolean => false,
    isSocket: (): boolean => false,
    isSymbolicLink: (): boolean => false,
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.Unknown)
})
