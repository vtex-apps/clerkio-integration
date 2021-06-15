export async function createFeedOrders(ctx: Context) {
  try {
    ctx.body = 'CreateFeedOrders'
  } catch (error) {
    throw new Error(error)
  }
}
