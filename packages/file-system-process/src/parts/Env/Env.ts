// TODO avoid using env variable, use argv argument instead
export const getRipGrepPath = (): string | undefined => {
  return process.env.RIP_GREP_PATH
}
