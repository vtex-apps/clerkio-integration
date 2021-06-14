import { VBase, LINKED } from '@vtex/api'

const BUCKET = `clerk-io${LINKED ? '-linked' : ''}`
const PRODUCT_PATH = 'product-feed'
const CATEGORY_PATH = 'category-feed'
const ORDER_PATH = 'order-feed'

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

  public saveCategoryFeed = ({
    categoryFeed,
  }: {
    categoryFeed: ClerkCategory[]
  }) =>
    this.saveJSON<FeedStructure<ClerkCategory>>(
      BUCKET,
      CATEGORY_PATH,
      this.feedStructure<ClerkCategory>(categoryFeed)
    )

  public getCategoryFeed = () =>
    this.getJSON<FeedStructure<ClerkCategory>>(BUCKET, CATEGORY_PATH, true)

  public saveOrderFeed = ({ orderFeed }: { orderFeed: ClerkOrder[] }) =>
    this.saveJSON<FeedStructure<ClerkOrder>>(
      BUCKET,
      ORDER_PATH,
      this.feedStructure<ClerkOrder>(orderFeed)
    )

  public getOrderFeed = () =>
    this.getJSON<FeedStructure<ClerkOrder>>(BUCKET, ORDER_PATH, true)

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
