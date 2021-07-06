import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export default class Search extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        VtexIdClientAutCookie: context.authToken,
      },
    })
  }

  public getProductsById = (productIds: string[]): Promise<any[]> => {
    let query = ''

    for (const productId of productIds) {
      query += `fq=productId:${productId}&`
    }

    return this.http.get(`/api/catalog_system/pub/products/search/?${query}`)
  }

  public getProductPrice = (productId: string): Promise<any> =>
    this.http.get(
      `https://api.vtex.com/powerplanet/pricing/prices/${productId}`
    )
}
