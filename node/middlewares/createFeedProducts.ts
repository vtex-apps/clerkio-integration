import { prepareFeedProducts } from '../services/products'

export async function createFeedProducts(
  ctx: Context,
  next: () => Promise<void>
) {
  // Send response and process feed products async
  await next()

  const {
    vtex: { logger },
  } = ctx

  try {
    prepareFeedProducts(ctx)
  } catch (error) {
    logger.error({
      message: 'Feed products could not be created',
      data: error.data,
    })

    throw new Error(error)
  }
}
