import { generateProductsFeed } from '../services/generateProductsFeed'

export async function createFeedProducts(
  ctx: Context,
  next: () => Promise<void>
) {
  const {
    clients: { feedManager },
  } = ctx

  const feedStatus = await feedManager.getFeedStatus('product')

  if (feedStatus && !feedStatus.finishedAt) {
    ctx.status = 200
    ctx.body = {
      message: 'Feed product already in progess',
      data: feedStatus,
    }

    return
  }

  // Send response and process feed products async
  await next()

  generateProductsFeed(ctx)
}
