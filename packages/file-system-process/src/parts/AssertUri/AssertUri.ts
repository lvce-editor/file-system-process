export const assertUri = (uri: string): void => {
  if (!uri.startsWith('file://')) {
    throw new Error(`path must be a valid file uri`)
  }
}
