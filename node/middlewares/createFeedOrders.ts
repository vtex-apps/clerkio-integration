import { generateOrderFeed } from '../services/generateOrderFeed'
import { feedInProgress } from '../utils'

export async function createFeedOrders(
  ctx: Context,
  next: () => Promise<void>
) {
  const {
    clients: { feedManager },
  } = ctx

  const feedStatus = await feedManager.getFeedStatus('order')

  if (feedStatus && feedInProgress(feedStatus)) {
    ctx.status = 200
    ctx.body = {
      message: 'Feed order already in progress',
      data: feedStatus,
    }

    return
  }

  // Send response and process feed orders async
  await next()

  generateOrderFeed(ctx)
}
