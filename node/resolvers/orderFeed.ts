import type { ReadStream } from 'fs'

type UploadFile<T> = Promise<{
  filename: string
  mimetype: string
  enconding: string
  createReadStream: () => T
}>

const generateOrderFeed = async (
  _root: unknown,
  args: { orderIdList: UploadFile<ReadStream> }
) => {
  // eslint-disable-next-line no-console
  console.log(args.orderIdList)

  return ''
}

const doNotCall = () => true

export const mutations = {
  generateOrderFeed,
}

export const queries = {
  doNotCall,
}
