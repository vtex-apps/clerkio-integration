import { IOClients } from '@vtex/api'

import Catalog from './catalog'
import searchGQL from './searchGQL'

export class Clients extends IOClients {
  public get catalog() {
    return this.getOrSet('catalog', Catalog)
  }

  public get searchGQL() {
    return this.getOrSet('searchGQL', searchGQL)
  }
}
