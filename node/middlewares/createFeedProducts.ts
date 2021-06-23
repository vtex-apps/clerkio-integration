export async function createFeedProducts(
  ctx: Context,
  next: () => Promise<void>
) {
  // Send response and process feed products async
  await next()

  try {
    // This will be replaced. We will save the processed feed to VBase
    ctx.body = 'CreateFeedProducts '
  } catch (error) {
    throw new Error(error)
  }
}
