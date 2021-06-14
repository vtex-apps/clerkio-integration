import { IOClients } from '@vtex/api'

import { FeedManager } from './FeedManager'

export class Clients extends IOClients {
  public get feedManager() {
    return this.getOrSet('feedManager', FeedManager)
  }
}
