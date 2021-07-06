import { generateOrderFeed } from '../services/generateOrderFeed'

export async function createFeedOrders(
  ctx: Context,
  next: () => Promise<void>
) {
  // Send response and process feed orders async
  await next()

  generateOrderFeed(ctx)
}
