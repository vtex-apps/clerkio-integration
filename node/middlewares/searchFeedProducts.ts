export async function searchFeedProducts(
  ctx: Context,
  next: () => Promise<void>
) {
  // Send response and process feed products async
  await next()

  const {
    clients: { graphqlServer },
    vtex: { logger },
  } = ctx

  try {
    const test = await graphqlServer.query('')

    // eslint-disable-next-line no-console
    console.log('test', test)
  } catch (error) {
    logger.error({
      message: 'Feed products could not be created',
      data: error.data,
    })

    // eslint-disable-next-line no-console
    console.log('Error', error)
    throw new Error(error)
  }
}
