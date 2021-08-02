import {
  getBindingSalesChannel,
  bindingsQuery,
  TENANT_GRAPHQL_APP,
} from '../utils'

export async function getBindingIntegrationInfo(
  ctx: Context,
  next: () => Promise<void>
) {
  const {
    clients: { feedManager, graphQLServer },
    vtex: {
      route: { params },
    },
  } = ctx

  try {
    const { data: tenantQuery } = await graphQLServer.query<TenantQuery>(
      bindingsQuery,
      TENANT_GRAPHQL_APP
    )

    const {
      tenantInfo: { bindings },
    } = tenantQuery

    const bindingId = params.bindingId as string
    const salesChannel = getBindingSalesChannel(bindings, bindingId)
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
