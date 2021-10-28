import type { ReadStream } from 'fs'

import { parseStreamToJSON } from '../utils/parseFile'

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

  const { createReadStream } = await args.orderIdList

  const orderListIdParsed = await parseStreamToJSON(createReadStream())

  // eslint-disable-next-line no-console
  console.log({ orderListIdParsed })

  return ''
}

const doNotCall = () => true

export const mutations = {
  generateOrderFeed,
}

export const queries = {
  doNotCall,
}
