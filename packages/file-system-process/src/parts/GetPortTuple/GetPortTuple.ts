import type { PortTuple } from '../PortTuple/PortTuple.ts'
import * as TemporaryMessagePort from '../TemporaryMessagePort/TemporaryMessagePort.ts'

export const getPortTuple = async (): Promise<PortTuple> => {
  const { port1, port2 } = await TemporaryMessagePort.getPortTuple()
  return {
    port1,
    port2,
  }
}
