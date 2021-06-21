import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export default class Catalog extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
    })
  }

  public getCategoryTree = (categoryLevels: number) =>
    this.http.get(`/api/catalog_system/pub/category/tree/${categoryLevels}`)
}
