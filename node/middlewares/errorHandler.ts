export async function errorHandler(ctx: Context, next: () => Promise<void>) {
  const {
    vtex: { logger },
  } = ctx

  try {
    await next()
  } catch (error) {
    logger.error({
      message: error.message,
      data: error,
    })

    ctx.status = error.status || 500
    ctx.body = error.message
    ctx.app.emit('error', error, ctx)
  }
}
