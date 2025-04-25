export const getFirstEvent = (eventEmitter: any, eventMap: any): Promise<any> => {
  const { resolve, promise } = Promise.withResolvers()
  const listenerMap = Object.create(null)
  const cleanup = (value: any): void => {
    for (const event of Object.keys(eventMap)) {
      eventEmitter.off(event, listenerMap[event])
    }
    resolve(value)
  }
  for (const [event, type] of Object.entries(eventMap)) {
    const listener = (event: any): void => {
      cleanup({
        type,
        event,
      })
    }
    eventEmitter.on(event, listener)
    listenerMap[event] = listener
  }
  return promise
}
