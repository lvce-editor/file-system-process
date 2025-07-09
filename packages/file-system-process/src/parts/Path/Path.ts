import * as NodePath from 'node:path'

export const join = (...parts: readonly string[]): string => {
  return NodePath.join(...parts)
}

export const dirname = (path: string): string => {
  return NodePath.dirname(path)
}

export const basename = (path: string): string => {
  return NodePath.basename(path)
}

export const resolve = (path: string): string => {
  return NodePath.resolve(path)
}

export const isAbsolute = (path: string): boolean => {
  return NodePath.isAbsolute(path)
}
