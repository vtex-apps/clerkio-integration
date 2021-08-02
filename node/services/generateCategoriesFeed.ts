import { transformCategoriesToClerk } from '../utils'

export async function generateCategoriesFeed(ctx: Context) {
  const {
    hostname,
    clients: { catalog, feedManager },
    vtex: { logger },
  } = ctx

  let feedStatus

  try {
    feedStatus = await feedManager.createFeedStatus('category')
  } catch (e) {
    logger.error({
      message: 'Error generating order feed status',
      date: new Date().toString(),
      error: e,
    })
  }

  if (!feedStatus) {
    return
  }

  try {
    const CATEGORY_LEVELS = 6
    const categoryTree = await catalog.getCategoryTree(CATEGORY_LEVELS)

    const categoryFeed = transformCategoriesToClerk(categoryTree, hostname)

    await feedManager.saveCategoryFeed({ categoryFeed })

    const finishedAt = new Date().toString()

    const feedStatusUpdated = {
      ...feedStatus,
      ...{ finishedAt, entries: categoryFeed.length },
    }

    await feedManager.updateFeedStatus(feedStatusUpdated)

    logger.info({
      message: 'Categories feed generated successfully',
      date: finishedAt,
    })
  } catch (error) {
    const finishedAt = new Date().toString()

    const feedStatusUpdated = {
      ...feedStatus,
      ...{ finishedAt, error: true },
    }

    await feedManager.updateFeedStatus(feedStatusUpdated)

    logger.error({
      message: 'Error generating categories feed',
      date: finishedAt,
      error,
    })
  }
}
