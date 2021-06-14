import { VBase, LINKED } from '@vtex/api'

const BUCKET = `clerk-io${LINKED ? '-linked' : ''}`
const PRODUCT_PATH = 'product-feed'

export class FeedManager extends VBase {
  public saveProductFeed = ({
    productFeed,
    locale,
  }: {
    locale: string
    productFeed: ClerkProduct[]
  }) =>
    this.saveJSON<FeedStructure<ClerkProduct>>(
      BUCKET,
      this.productPath(locale),
      this.feedStructure<ClerkProduct>(productFeed)
    )

  public getProductFeed = (locale: string) =>
    this.getJSON<FeedStructure<ClerkProduct>>(
      BUCKET,
      this.productPath(locale),
      true
    )

  public saveCategoryFeed = () => {}

  public getCategoryFeed = () => {}

  public saveOrderFeed = () => {}

  public getOrderFeed = () => {}

  private productPath = (locale: string): string => `${PRODUCT_PATH}-${locale}`
  private feedStructure = <FeedType>(
    data: FeedType[]
  ): FeedStructure<FeedType> => {
    return {
      data,
      createdAt: new Date().getTime(),
    }
  }
}
