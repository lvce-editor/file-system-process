import { test, expect } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as GetDirentType from '../src/parts/GetDirentType/GetDirentType.js'

test('getDirentType returns correct type for file', (): void => {
  const mockDirent = {
    isFile: (): boolean => true,
    isDirectory: (): boolean => false,
    isSymbolicLink: (): boolean => false,
    isSocket: (): boolean => false,
    isBlockDevice: (): boolean => false,
    isCharacterDevice: (): boolean => false,
    isFIFO: (): boolean => false,
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.File)
})

test('getDirentType returns correct type for directory', (): void => {
  const mockDirent = {
    isFile: (): boolean => false,
    isDirectory: (): boolean => true,
    isSymbolicLink: (): boolean => false,
    isSocket: (): boolean => false,
    isBlockDevice: (): boolean => false,
    isCharacterDevice: (): boolean => false,
    isFIFO: (): boolean => false,
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.Directory)
})

test('getDirentType returns correct type for symlink', (): void => {
  const mockDirent = {
    isFile: (): boolean => false,
    isDirectory: (): boolean => false,
    isSymbolicLink: (): boolean => true,
    isSocket: (): boolean => false,
    isBlockDevice: (): boolean => false,
    isCharacterDevice: (): boolean => false,
    isFIFO: (): boolean => false,
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.Symlink)
})

test('getDirentType returns correct type for socket', (): void => {
  const mockDirent = {
    isFile: (): boolean => false,
    isDirectory: (): boolean => false,
    isSymbolicLink: (): boolean => false,
    isSocket: (): boolean => true,
    isBlockDevice: (): boolean => false,
    isCharacterDevice: (): boolean => false,
    isFIFO: (): boolean => false,
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.Socket)
})

test('getDirentType returns correct type for block device', (): void => {
  const mockDirent = {
    isFile: (): boolean => false,
    isDirectory: (): boolean => false,
    isSymbolicLink: (): boolean => false,
    isSocket: (): boolean => false,
    isBlockDevice: (): boolean => true,
    isCharacterDevice: (): boolean => false,
    isFIFO: (): boolean => false,
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.BlockDevice)
})

test('getDirentType returns correct type for character device', (): void => {
  const mockDirent = {
    isFile: (): boolean => false,
    isDirectory: (): boolean => false,
    isSymbolicLink: (): boolean => false,
    isSocket: (): boolean => false,
    isBlockDevice: (): boolean => false,
    isCharacterDevice: (): boolean => true,
    isFIFO: (): boolean => false,
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.CharacterDevice)
})

test('getDirentType returns correct type for fifo', (): void => {
  const mockDirent = {
    isFile: (): boolean => false,
    isDirectory: (): boolean => false,
    isSymbolicLink: (): boolean => false,
    isSocket: (): boolean => false,
    isBlockDevice: (): boolean => false,
    isCharacterDevice: (): boolean => false,
    isFIFO: (): boolean => true,
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.Fifo)
})

test('getDirentType returns unknown for unrecognized type', (): void => {
  const mockDirent = {
    isFile: (): boolean => false,
    isDirectory: (): boolean => false,
    isSymbolicLink: (): boolean => false,
    isSocket: (): boolean => false,
    isBlockDevice: (): boolean => false,
    isCharacterDevice: (): boolean => false,
    isFIFO: (): boolean => false,
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.Unknown)
})
