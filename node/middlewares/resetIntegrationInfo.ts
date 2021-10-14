export async function resetIntegrationInfo(ctx: Context) {
  const {
    clients: { feedManager },
    vtex: {
      route: { params },
      logger,
    },
  } = ctx

  const { bindingId } = params

  await feedManager.resetLastIntegrationInfo(bindingId as string)

  logger.info({
    message: `Integration information for binding ${bindingId} reseted`,
  })

  ctx.status = 200
}
