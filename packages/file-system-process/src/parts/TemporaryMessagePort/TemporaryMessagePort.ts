import type { MessagePort } from 'node:worker_threads'
import * as Assert from '../Assert/Assert.ts'
import * as Id from '../Id/Id.ts'
import * as SharedProcess from '../SharedProcess/SharedProcess.ts'

export const state = {
  ports: Object.create(null),
}

export const getPortTuple = async (): Promise<any> => {
  const id1 = Id.create()
  const id2 = Id.create()
  // @ts-ignore
  await SharedProcess.invoke('TemporaryMessagePort.getPortTuple2', id1, id2)
  const port1 = state.ports[id1]
  const port2 = state.ports[id2]
  delete state.ports[id1]
  delete state.ports[id2]
  return {
    port1,
    port2,
  }
}

export const handlePorts = (port1: MessagePort, port2: MessagePort, id1: number, id2: number): void => {
  Assert.number(id1)
  Assert.number(id2)
  Assert.object(port1)
  Assert.object(port2)
  state.ports[id1] = port1
  state.ports[id2] = port2
}
