import { VBase, LINKED } from '@vtex/api'

const BUCKET = `clerk-io${LINKED ? '-linked' : ''}`
const PRODUCT_PATH = 'product-feed'
const CATEGORY_PATH = 'category-feed'
const ORDER_PATH = 'order-feed'
const LAST_INTEGRATION = 'last-int'
const FEED_STATUS = 'status'

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

  public createFeedStatus = async (type: FeedType) => {
    const feedStatusStructure = this.feedStatusStructure({ type })

    await this.saveJSON(BUCKET, this.statusPath(type), feedStatusStructure)

    return feedStatusStructure
  }

  public getFeedStatus = (type: FeedType) =>
    this.getJSON<FeedStatus | null>(BUCKET, this.statusPath(type), true)

  public updateFeedStatus = (feedStatus: FeedStatus) => {
    const feedStatusStructure = this.feedStatusStructure(feedStatus)

    return this.saveJSON(
      BUCKET,
      this.statusPath(feedStatus.type),
      feedStatusStructure
    )
  }

  private productPath = (locale: string): string => `${PRODUCT_PATH}-${locale}`
  private lastIntegrationPath = (locale: string): string =>
    `${LAST_INTEGRATION}-${locale}`

  private statusPath = (feedType: FeedType): string =>
    `${FEED_STATUS}-${feedType}`

  private feedStructure = <FeedDataType>(
    data: FeedDataType[]
  ): FeedStructure<FeedDataType> => {
    return {
      data,
      createdAt: new Date().getTime(),
    }
  }

  private feedStatusStructure = ({
    startedAt,
    type,
    finishedAt,
    entries,
    error,
  }: FeedStatus): FeedStatus => {
    return {
      type,
      startedAt: startedAt ?? new Date().toString(),
      finishedAt,
      entries,
      error,
    }
  }
}
