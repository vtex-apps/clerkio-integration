export async function getPublicFeed(ctx: Context, next: () => void) {
  // console.log(ctx)
  ctx.set('Cache-Control', 'no-cache, no-store')
  const {
    clients: { apps, feedManager },
  } = ctx
  const appSettings = await apps.getAppSettings(
    process.env.VTEX_APP_ID as string
  )
  console.log(appSettings)
  const { bindingId, salesChannel } = appSettings.settings[0]
  const lastIntegration = await feedManager.getLastIntegration(bindingId)
  try {
    ctx.state.bindingIntegrationInfo = {
      bindingId,
      salesChannel,
      lastIntegration,
    }
    await next()
  } catch (error) {
    throw new Error(error)
  }
}
