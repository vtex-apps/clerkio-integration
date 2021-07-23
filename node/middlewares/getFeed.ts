import {
  getBindingSalesChannel,
  bindingsQuery,
  TENANT_GRAPHQL_APP,
} from '../utils'

export async function getFeed(ctx: Context) {
  const {
    clients: { feedManager, graphQLServer },
    vtex: {
      logger,
      route: { params },
    },
  } = ctx

  try {
    const bindingId = params.bindingId as string

    const { data: tenantQuery } = await graphQLServer.query<TenantQuery>(
      bindingsQuery,
      TENANT_GRAPHQL_APP
    )

    const {
      tenantInfo: { bindings },
    } = tenantQuery

    const salesChannel = getBindingSalesChannel(bindings, bindingId)

    const lastIntegration = await feedManager.getLastIntegration(bindingId)

    const orderIntegratedAt = lastIntegration?.orderIntegratedAt

    let products: ClerkProduct[] = []
    let categories: ClerkCategory[] = []
    let orders: ClerkOrder[] = []

    const clerkFeed: ClerkFeed = { products, categories }
    const promises: Array<Promise<any>> = []

    promises.push(feedManager.getProductFeed(bindingId))
    promises.push(feedManager.getCategoryFeed())

    if (!lastIntegration || !orderIntegratedAt) {
      promises.push(feedManager.getOrderFeed())

      const [productsRes, categoriesRes, ordersRes] = await Promise.all(
        promises
      )

      products = [...productsRes.data]
      categories = [...categoriesRes.data]
      orders = [...ordersRes.data]
      orders = orders.filter(order => order.salesChannel === salesChannel)
    } else {
      const [productsRes, categoriesRes] = await Promise.all(promises)

      products = [...productsRes.data]
      categories = [...categoriesRes.data]
    }

    clerkFeed.products = products
    clerkFeed.categories = categories

    if (orders.length) {
      clerkFeed.orders = orders
    }

    ctx.body = clerkFeed

    const lastIntegrationUpdated = {
      bindingId,
      orderIntegratedAt: orderIntegratedAt ?? new Date().getTime(),
      products: products.length,
      categories: categories.length,
    }

    feedManager.updateLastIntegration(lastIntegrationUpdated)

    logger.info({
      message: 'Feed integrated susccesfully',
      data: lastIntegrationUpdated,
    })
  } catch (error) {
    throw new Error(error)
  }
}
