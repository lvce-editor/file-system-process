export const addToArrayUnique = (recentlyOpened: readonly string[], path: string): readonly string[] => {
  const index = recentlyOpened.indexOf(path)
  if (index === -1) {
    return [path, ...recentlyOpened]
  }
  return [path, ...recentlyOpened.slice(0, index), ...recentlyOpened.slice(index + 1)]
}
