import { prepareFeedCategories } from '../services/categories'

export async function createFeedCategories(
  ctx: Context,
  next: () => Promise<void>
) {
  // Send response and process feed categories async
  await next()

  const {
    hostname,
    clients: { catalog },
  } = ctx

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
