import { RpcId } from '@lvce-editor/rpc-registry'
import type { PortTuple } from '../PortTuple/PortTuple.ts'
import * as Assert from '../Assert/Assert.ts'
import * as Id from '../Id/Id.ts'
import * as SharedProcess from '../SharedProcess/SharedProcess.ts'

const ports = Object.create(null)

export const getPortTuple = async (): Promise<PortTuple> => {
  const id1 = Id.create()
  const id2 = Id.create()
  // @ts-ignore
  await SharedProcess.invoke('TemporaryMessagePort.getPortTuple3', id1, id2, RpcId.FileSystemProcess)
  const port1 = ports[id1]
  const port2 = ports[id2]
  delete ports[id1]
  delete ports[id2]
  return {
    port1,
    port2,
  }
}

export const handlePorts = (port1: any, port2: any, id1: number, id2: number): void => {
  Assert.number(id1)
  Assert.number(id2)
  Assert.object(port1)
  Assert.object(port2)
  ports[id1] = port1
  ports[id2] = port2
}
