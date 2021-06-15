import type {
  ClientsConfig,
  ParamsContext,
  RecorderState,
  ServiceContext,
} from '@vtex/api'
import { method, Service } from '@vtex/api'

import { Clients } from './clients'
import {
  errorHandler,
  feed,
  createFeedCategories,
  createFeedProducts,
  createFeedOrders,
} from './middlewares'

const TIMEOUT_MS = 800

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients>
}

export default new Service<Clients, RecorderState, ParamsContext>({
  clients,
  routes: {
    createFeedCategories: method({
      POST: [errorHandler, createFeedCategories],
    }),
    createFeedProducts: method({
      POST: [errorHandler, createFeedProducts],
    }),
    createFeedOrders: method({
      POST: [errorHandler, createFeedOrders],
    }),
    feed: method({
      GET: [errorHandler, feed],
    }),
  },
})
