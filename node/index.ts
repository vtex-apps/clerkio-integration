import type { ServiceContext } from '@vtex/api'
import { Service } from '@vtex/api'

declare global {
  type Context = ServiceContext
}

export default new Service({
  routes: {
    feed: (ctx: Context) => {
      const {
        vtex: {
          route: { params },
        },
      } = ctx

      ctx.body = params
    },
  },
})
