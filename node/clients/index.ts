import { IOClients } from '@vtex/api'

import { FeedManager } from './FeedManager'
import Catalog from './catalog'
import searchGQL from './searchGQL'
import Orders from './orders'

export class Clients extends IOClients {
  public get catalog() {
    return this.getOrSet('catalog', Catalog)
  }

  public get feedManager() {
    return this.getOrSet('feedManager', FeedManager)
  }

  public get searchGQL() {
    return this.getOrSet('searchGQL', searchGQL)
  }

  public get orders() {
    return this.getOrSet('orders', Orders)
  }
}
