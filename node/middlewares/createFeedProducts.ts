import { parse } from 'querystring'

import { generateProductsFeed } from '../services/generateProductsFeed'
import { feedInProgress } from '../utils'

export async function createFeedProducts(
  ctx: Context,
  next: () => Promise<void>
) {
  const {
    clients: { feedManager },
    querystring,
  } = ctx

  const { force } = parse(querystring)

  const feedStatus = await feedManager.getFeedStatus('product')

  if (!force && feedStatus && feedInProgress(feedStatus)) {
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
