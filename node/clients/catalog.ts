import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export default class Catalog extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        VtexIdClientAutCookie: context.authToken,
      },
    })
  }

  public getCategoryTree = (
    categoryLevels: number
  ): Promise<CategoryTreeItem[]> =>
    this.http.get(`/api/catalog_system/pub/category/tree/${categoryLevels}`)

  public getProductAndSkuIds = (
    _from: number,
    _to: number
  ): Promise<ProductAndSkuIds> =>
    this.http.get(`/api/catalog_system/pvt/products/GetProductAndSkuIds`, {
      params: { _from, _to },
    })
}
