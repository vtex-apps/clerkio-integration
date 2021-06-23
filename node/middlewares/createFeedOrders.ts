export async function createFeedOrders(
  ctx: Context,
  next: () => Promise<void>
) {
  // Send response and process feed orders async
  await next()

  try {
    // This will be replaced. We will save the processed feed to VBase
    ctx.body = 'CreateFeedOrders'
  } catch (error) {
    throw new Error(error)
  }
}
