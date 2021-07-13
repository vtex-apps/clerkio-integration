import { generateCategoriesFeed } from '../services/generateCategoriesFeed'

export async function createFeedCategories(
  ctx: Context,
  next: () => Promise<void>
) {
  const {
    clients: { feedManager },
  } = ctx

  const feedStatus = await feedManager.getFeedStatus('category')

  if (feedStatus && !feedStatus.finishedAt) {
    ctx.status = 200
    ctx.body = {
      message: 'Feed category already in progress',
      data: feedStatus,
    }

    return
  }

  // Send response and process feed categories async
  await next()

  generateCategoriesFeed(ctx)
}
