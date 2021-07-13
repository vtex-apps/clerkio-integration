import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

import { createListOrderParams } from '../utils'

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

  public listorders({
    creationDate,
    page,
  }: ListOrderParams): Promise<OrderListResponse> {
    const filterParams = createListOrderParams({ creationDate, page })

    return this.http.get<OrderListResponse>(this.routes.listOrders(), {
      params: filterParams,
    })
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
