import { IOClients } from '@vtex/api'

import { FeedManager } from './FeedManager'
import Catalog from './catalog'
import GraphQLServer from './graphqlServer'
import Orders from './orders'

export class Clients extends IOClients {
  public get catalog() {
    return this.getOrSet('catalog', Catalog)
  }

  public get feedManager() {
    return this.getOrSet('feedManager', FeedManager)
  }

  public get graphQLServer() {
    return this.getOrSet('graphqlServer', GraphQLServer)
  }

  public get orders() {
    return this.getOrSet('orders', Orders)
  }
}
