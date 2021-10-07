export async function getFeed(ctx: Context) {
  const {
    clients: { feedManager },
    state: {
      bindingIntegrationInfo: { bindingId, salesChannel, lastIntegration },
    },
    vtex: { logger },
  } = ctx

  try {
    const orderIntegratedAt = lastIntegration?.orderIntegratedAt

    let products: ClerkProduct[] = []
    let categories: ClerkCategory[] = []
    let orders: ClerkOrder[] = []

    const promises: Array<Promise<any>> = [
      feedManager.getProductFeed(bindingId),
      feedManager.getCategoryFeed(),
    ]

    const [productsRes, categoriesRes] = await Promise.all(promises)

    if (productsRes) {
      products = [...productsRes.data]
    }

    if (categoriesRes) {
      categories = [...categoriesRes.data]
    }

    const clerkFeed: ClerkFeed = { products, categories }

    if (!lastIntegration || !orderIntegratedAt) {
      const ordersRes = await feedManager.getOrderFeed()

      if (ordersRes) {
        orders = [...ordersRes.data]
        orders = orders.filter(order => order.salesChannel === salesChannel)
        clerkFeed.orders = orders
      }
    }

    ctx.body = clerkFeed

    const lastIntegrationUpdated: IntegrationInfoInput = {
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
