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
  getFeed,
  createFeedCategories,
  createFeedProducts,
  createFeedOrders,
  sendResponse,
  feedStatus,
  getBindingIntegrationInfo,
  parseAppSetings,
} from './middlewares'
import { mutations, queries } from './resolvers'

const TIMEOUT_MS = 800
const LONG_TIMEOUT_MS = 1200

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    orders: {
      retries: 4,
      timeout: LONG_TIMEOUT_MS,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    bindingIntegrationInfo: {
      bindingId: string
      salesChannel: string
      lastIntegration: IntegrationInfo | null
    }
    appConfig: AppConfig
  }
}

export default new Service<Clients, State, ParamsContext>({
  clients,
  graphql: {
    resolvers: {
      Mutation: {
        ...mutations,
      },
      Query: {
        ...queries,
      },
    },
  },
  routes: {
    createFeedCategories: method({
      POST: [errorHandler, parseAppSetings, createFeedCategories, sendResponse],
    }),
    createFeedProducts: method({
      POST: [errorHandler, parseAppSetings, createFeedProducts, sendResponse],
    }),
    createFeedOrders: method({
      POST: [errorHandler, parseAppSetings, createFeedOrders, sendResponse],
    }),
    feed: method({
      GET: [errorHandler, parseAppSetings, getBindingIntegrationInfo, getFeed],
    }),
    feedStatus: method({
      GET: [errorHandler, feedStatus],
    }),
  },
})
