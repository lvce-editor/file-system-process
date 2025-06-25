import { test, expect } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as GetDirentType from '../src/parts/GetDirentType/GetDirentType.js'

test('getDirentType returns correct type for file', () => {
  const mockDirent = {
    isFile: () => true,
    isDirectory: () => false,
    isSymbolicLink: () => false,
    isSocket: () => false,
    isBlockDevice: () => false,
    isCharacterDevice: () => false,
    isFIFO: () => false
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.File)
})

test('getDirentType returns correct type for directory', () => {
  const mockDirent = {
    isFile: () => false,
    isDirectory: () => true,
    isSymbolicLink: () => false,
    isSocket: () => false,
    isBlockDevice: () => false,
    isCharacterDevice: () => false,
    isFIFO: () => false
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.Directory)
})

test('getDirentType returns correct type for symlink', () => {
  const mockDirent = {
    isFile: () => false,
    isDirectory: () => false,
    isSymbolicLink: () => true,
    isSocket: () => false,
    isBlockDevice: () => false,
    isCharacterDevice: () => false,
    isFIFO: () => false
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.Symlink)
})

test('getDirentType returns correct type for socket', () => {
  const mockDirent = {
    isFile: () => false,
    isDirectory: () => false,
    isSymbolicLink: () => false,
    isSocket: () => true,
    isBlockDevice: () => false,
    isCharacterDevice: () => false,
    isFIFO: () => false
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.Socket)
})

test('getDirentType returns correct type for block device', () => {
  const mockDirent = {
    isFile: () => false,
    isDirectory: () => false,
    isSymbolicLink: () => false,
    isSocket: () => false,
    isBlockDevice: () => true,
    isCharacterDevice: () => false,
    isFIFO: () => false
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.BlockDevice)
})

test('getDirentType returns correct type for character device', () => {
  const mockDirent = {
    isFile: () => false,
    isDirectory: () => false,
    isSymbolicLink: () => false,
    isSocket: () => false,
    isBlockDevice: () => false,
    isCharacterDevice: () => true,
    isFIFO: () => false
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.CharacterDevice)
})

test('getDirentType returns correct type for fifo', () => {
  const mockDirent = {
    isFile: () => false,
    isDirectory: () => false,
    isSymbolicLink: () => false,
    isSocket: () => false,
    isBlockDevice: () => false,
    isCharacterDevice: () => false,
    isFIFO: () => true
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.Fifo)
})

test('getDirentType returns unknown for unrecognized type', () => {
  const mockDirent = {
    isFile: () => false,
    isDirectory: () => false,
    isSymbolicLink: () => false,
    isSocket: () => false,
    isBlockDevice: () => false,
    isCharacterDevice: () => false,
    isFIFO: () => false
  }
  expect(GetDirentType.getDirentType(mockDirent as any)).toBe(DirentType.Unknown)
})