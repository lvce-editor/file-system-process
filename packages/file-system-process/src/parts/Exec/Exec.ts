import { execa } from 'execa'
import * as Assert from '../Assert/Assert.ts'

export const exec = async (command: string, args: readonly string[], options: any): Promise<any> => {
  Assert.string(command)
  Assert.array(args)
  Assert.object(options)
  const { stdout, stderr } = await execa(command, args, options)
  return {
    stdout,
    stderr,
  }
}
