export async function feedStatus(ctx: Context) {
  const {
    clients: { feedManager },
    vtex: {
      route: { params },
    },
  } = ctx

  ctx.set('Cache-Control', 'no-cache, no-store')

  const { type } = params

  const status = await feedManager.getFeedStatus(type as FeedType)

  ctx.status = 200
  ctx.body = status ?? { message: 'Feed not started yet' }
}
