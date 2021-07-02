export async function createFeedOrders(
  _ctx: Context,
  next: () => Promise<void>
) {
  // Send response and process feed orders async
  await next()
}
