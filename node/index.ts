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
  sendResponse,
  feedStatus,
} from './middlewares'
import { parseAppSetings } from './middlewares/parseAppSettings'

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
    appConfig: AppConfig
  }
}

export default new Service<Clients, State, ParamsContext>({
  clients,
  routes: {
    /**
     * feed Manager Test: Only for test purpose. Can be delete after it
     * @param ctx
     * @returns
     */
    feedManagerTest: async (ctx: Context) => {
      const {
        clients: { feedManager },
        vtex: {
          route: { params },
        },
      } = ctx

      ctx.set('Cache-Control', 'no-cache')

      const { feedType, locale } = params

      if (feedType === 'products') {
        await feedManager.saveProductFeed({
          locale: locale as string,
          productFeed: [
            {
              id: '1',
              name: `name-1-${locale}`,
              description: `description-1-${locale}`,
              price: 0,
              image: `image-1-${locale}`,
              url: `url-1-${locale}`,
              categories: [1, 2],
              created_at: new Date().getTime(),
            },
            {
              id: '2',
              name: `name-2-${locale}`,
              description: `description-2-${locale}`,
              price: 0,
              image: `image-2-${locale}`,
              url: `url-2-${locale}`,
              categories: [3, 4],
              created_at: new Date().getTime(),
            },
          ],
        })

        ctx.body = await feedManager.getProductFeed(locale as string)
      } else if (feedType === 'categories') {
        await feedManager.saveCategoryFeed({
          categoryFeed: [
            {
              id: '1',
              name: 'name-1',
              url: 'url-1',
              subcategories: ['2'],
            },
            {
              id: '2',
              name: 'name-2',
              url: 'url-2',
              subcategories: [],
            },
          ],
        })

        ctx.body = await feedManager.getCategoryFeed()
      } else if (feedType === 'orders') {
        await feedManager.saveOrderFeed({
          orderFeed: [
            {
              id: '1',
              products: [
                {
                  id: '1',
                  quantity: 2,
                  price: 10,
                },
                {
                  id: '2',
                  quantity: 1,
                  price: 20,
                },
              ],
              time: new Date().getTime(),
              email: 'test@vtex.com',
            },
            {
              id: '2',
              products: [
                {
                  id: '3',
                  quantity: 2,
                  price: 10,
                },
                {
                  id: '4',
                  quantity: 1,
                  price: 20,
                },
              ],
              time: new Date().getTime(),
              email: 'test-2@vtex.com',
            },
          ],
        })

        ctx.body = await feedManager.getOrderFeed()
      } else if (feedType === 'integrate') {
        const date = new Date().getTime()
        const newFeedInfo: IntegrationInfoInput = {
          locale: locale as string,
          products:
            (await feedManager.getProductFeed(locale as string))?.data.length ??
            0,
          categories: (await feedManager.getCategoryFeed())?.data.length ?? 0,
          orderIntegratedAt:
            (await feedManager.ordersIntegratedAt(locale as string)) ?? date,
        }

        await feedManager.updateLastIntegration(newFeedInfo)

        ctx.body = await feedManager.getLastIntegration(locale as string)
      }
    },
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
      GET: [errorHandler, feed],
    }),
    feedStatus: method({
      GET: [errorHandler, feedStatus],
    }),
  },
})
