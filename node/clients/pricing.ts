import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export default class Pricing extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        VtexIdClientAutCookie: context.authToken,
      },
    })
  }

  public getPrice = (productId: string): Promise<any> =>
    this.http.get(`/pricing/prices/${productId}`)
}
