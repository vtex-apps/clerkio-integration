import type { ReadStream } from 'fs'

import JSONStream from 'JSONStream'

export const parseStreamToJSON = <T>(stream: ReadStream): Promise<T[]> => {
  const promise = new Promise<T[]>(resolve => {
    const finalArray: T[] = []

    stream.pipe(
      JSONStream.parse('*').on('data', (data: T) => {
        finalArray.push(data)
      })
    )
    stream.on('end', () => {
      stream.destroy()
      resolve(finalArray)
    })
  })

  return promise
}
