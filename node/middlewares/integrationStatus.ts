export async function integrationStatus(ctx: Context) {
  const {
    clients: { feedManager },
    vtex: {
      route: { params },
    },
  } = ctx

  const { bindingId } = params

  const lastIntegration = await feedManager.getLastIntegration(
    bindingId as string
  )

  ctx.set('Cache-Control', 'no-cache, no-store')

  ctx.status = 200
  ctx.body = lastIntegration
}
