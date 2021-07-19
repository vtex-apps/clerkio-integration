export async function getFeed(ctx: Context) {
  const {
    clients: { feedManager },
    vtex: {
      route: { params },
    },
  } = ctx

  const locale = params.locale as string

  const productsPromise = feedManager.getProductFeed(locale)
  const categoriesPromise = feedManager.getCategoryFeed()
  const ordersPromise = feedManager.getOrderFeed()

  const [products, categories, orders] = await Promise.all([
    productsPromise,
    categoriesPromise,
    ordersPromise,
  ])

  const clerkFeed = {
    products: products?.data,
    categories: categories?.data,
    orders: orders?.data,
  }

  ctx.body = clerkFeed
}
