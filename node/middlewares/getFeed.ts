export async function getFeed(ctx: Context) {
  const {
    clients: { feedManager },
    state: {
      bindingIntegrationInfo: { bindingId, salesChannel, lastIntegration },
      isVtex,
    },
    vtex: { logger },
  } = ctx

  try {
    const orderIntegratedAt = lastIntegration?.orderIntegratedAt
    const orderIntegrated = lastIntegration?.orders

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

    // It should include orders if:
    // 1. Call is from VTEX (private route)
    // 2. Call is from Clerk (isVtex === undefined)
    // 2.1 Last Integration doesn't exist (null)
    // 2.2 orderIntegrateAt is falsy (undefined, null or empty string)
    if (isVtex || !lastIntegration || !orderIntegratedAt) {
      const ordersRes = await feedManager.getOrderFeed()

      if (ordersRes) {
        orders = [...ordersRes.data]
        orders = orders.filter(order => order.salesChannel === salesChannel)
        clerkFeed.orders = orders
      }
    }

    ctx.body = clerkFeed

    // Just update integration status when request comes from Clerk, not
    // VTEX
    if (!isVtex) {
      const lastIntegrationUpdated: IntegrationInfoInput = {
        bindingId,
        orderIntegratedAt: orderIntegratedAt ?? new Date().toString(),
        products: products.length,
        categories: categories.length,
        orders: orderIntegrated ?? orders.length,
      }

      feedManager.updateLastIntegration(lastIntegrationUpdated)

      logger.info({
        message: 'Feed integrated susccesfully',
        data: lastIntegrationUpdated,
      })
    }
  } catch (error) {
    throw new Error(error)
  }
}
