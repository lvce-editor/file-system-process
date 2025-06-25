import _trash from 'trash'

// @ts-ignore
export const trash = async (path: string): Promise<void> => {
  await _trash(path)
}
