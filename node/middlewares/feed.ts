export async function feed(ctx: Context) {
  const {
    clients: { feedManager },
    vtex: {
      route: { params },
    },
  } = ctx

  // eslint-disable-next-line no-console
  console.log({ params })

  const orders = await feedManager.getOrderFeed()

  ctx.body = {
    products: [],
    categories: [],
    orders,
  }
}
