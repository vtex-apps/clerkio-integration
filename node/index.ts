import type {
  ClientsConfig,
  ParamsContext,
  RecorderState,
  ServiceContext,
} from '@vtex/api'
import { Service } from '@vtex/api'

import { Clients } from './clients'
import { flattenArray } from './utils'

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
    feed: (ctx: Context) => {
      const {
        vtex: {
          route: { params },
        },
      } = ctx

      ctx.body = params
    },
    getCategories: async (ctx: Context) => {
      const {
        clients: { catalog },
      } = ctx

      const res = await catalog.getCategoryTree(5)
      const feedCategories = flattenArray(res)

      ctx.status = 200
      ctx.body = feedCategories
    },
  },
})
