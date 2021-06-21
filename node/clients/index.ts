import { IOClients } from '@vtex/api'

import { FeedManager } from './FeedManager'
import Catalog from './catalog'

export class Clients extends IOClients {
  public get catalog() {
    return this.getOrSet('catalog', Catalog)
  }

  public get feedManager() {
    return this.getOrSet('feedManager', FeedManager)
  }
}
