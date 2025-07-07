const state = {
  id: 0,
}

export const create = (): number => {
  return ++state.id
}
