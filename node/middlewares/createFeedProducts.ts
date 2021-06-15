export async function createFeedProducts(ctx: Context) {
  try {
    ctx.body = 'CreateFeedProducts '
  } catch (error) {
    throw new Error(error)
  }
}
