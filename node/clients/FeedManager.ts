import { VBase, LINKED } from '@vtex/api'

const BUCKET = `clerk-io${LINKED ? '-linked' : ''}`
const PRODUCT_PATH = 'product-feed'
const CATEGORY_PATH = 'category-feed'
const ORDER_PATH = 'order-feed'
const LAST_INTEGRATION = 'last-int'

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
    this.getJSON<FeedStructure<ClerkProduct> | null>(
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
    this.getJSON<FeedStructure<ClerkCategory> | null>(
      BUCKET,
      CATEGORY_PATH,
      true
    )

  public saveOrderFeed = ({ orderFeed }: { orderFeed: ClerkOrder[] }) =>
    this.saveJSON<FeedStructure<ClerkOrder>>(
      BUCKET,
      ORDER_PATH,
      this.feedStructure<ClerkOrder>(orderFeed)
    )

  public getOrderFeed = () =>
    this.getJSON<FeedStructure<ClerkOrder> | null>(BUCKET, ORDER_PATH, true)

  public updateLastIntegration = async ({
    locale,
    products,
    orderIntegratedAt,
    categories,
  }: IntegrationInfoInput) =>
    this.saveJSON<IntegrationInfo>(BUCKET, this.lastIntegrationPath(locale), {
      products,
      orderIntegratedAt,
      categories,
      integratedAt: new Date().getTime(),
    })

  public getLastIntegration = (locale: string) =>
    this.getJSON<IntegrationInfo | null>(
      BUCKET,
      this.lastIntegrationPath(locale),
      true
    )

  public ordersIntegratedAt = async (
    locale: string
  ): Promise<number | undefined> => {
    const lastIntegration = await this.getLastIntegration(locale)

    return lastIntegration?.orderIntegratedAt
  }

  private productPath = (locale: string): string => `${PRODUCT_PATH}-${locale}`
  private lastIntegrationPath = (locale: string): string =>
    `${LAST_INTEGRATION}-${locale}`

  private feedStructure = <FeedType>(
    data: FeedType[]
  ): FeedStructure<FeedType> => {
    return {
      data,
      createdAt: new Date().getTime(),
    }
  }
}
