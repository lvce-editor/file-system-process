import _trash from 'trash'

// @ts-ignore
export const trash = async (path) => {
  await _trash(path)
}
