import { prepareFeedCategories } from '../utils'

export async function createFeedCategories(
  ctx: Context,
  next: () => Promise<void>
) {
  const {
    hostname,
    clients: { catalog },
  } = ctx

  // Send response and process feed categories async
  await next()

  try {
    const categoryLevels = 6
    const categoryTree = await catalog.getCategoryTree(categoryLevels)
    const feedCategories = prepareFeedCategories(categoryTree, hostname)

    // This will be replaced. We will save the processed feed to VBase
    ctx.body = feedCategories
  } catch (error) {
    throw new Error(error)
  }
}
