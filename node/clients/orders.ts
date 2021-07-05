import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export default class Orders extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...options?.headers,
        VtexIdclientAutCookie: context.authToken,
      },
    })
  }

  public listorders() {
    return this.http.get<OrderListResponse>(this.routes.listOrders())
  }

  public order(orderId: string) {
    return this.http.get<Order>(this.routes.order(orderId))
  }

  private get routes() {
    const basePath = '/api/oms/pvt/orders'

    return {
      order: (orderId: string) => `${basePath}/${orderId}`,
      listOrders: () => basePath,
    }
  }
}
