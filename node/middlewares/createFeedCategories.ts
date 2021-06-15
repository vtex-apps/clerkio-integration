import { prepareFeedCategories } from '../utils'

export async function createFeedCategories(ctx: Context) {
  const {
    hostname,
    clients: { catalog },
  } = ctx

  try {
    const categoryLevels = 6
    const categoryTree = await catalog.getCategoryTree(categoryLevels)
    const feedCategories = prepareFeedCategories(categoryTree, hostname)

    ctx.body = feedCategories
  } catch (error) {
    throw new Error(error)
  }
}
