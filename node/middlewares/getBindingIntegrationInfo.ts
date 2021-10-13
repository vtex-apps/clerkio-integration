import { getBindingSalesChannel } from '../utils'

export async function getBindingIntegrationInfo(
  ctx: Context,
  next: () => Promise<void>
) {
  const {
    clients: { feedManager },
    vtex: {
      route: { params },
    },
    state: {
      appConfig: { settings: storeBindings },
    },
  } = ctx

  try {
    const bindingId = params.bindingId as string
    const salesChannel = getBindingSalesChannel(storeBindings, bindingId)
    const lastIntegration = await feedManager.getLastIntegration(bindingId)

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
