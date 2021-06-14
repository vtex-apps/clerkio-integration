interface ClerkFeed {
  products: ClerkProduct[]
  categories: ClerkCategory[]
  order?: ClerkOrder[]
  customers?: ClerkCustomer[]
  pages?: ClerkPage[]
  config: {
    /**
     * Optional. A timestamp indicating when the feed was last updated. This is used for product versioning if real time product updates are pushed via the API.
     *
     * This must be a unix timestamp
     * @type {number}
     */
    created?: number
    /**
     * Optional. Should the feed be parsed in strict mode or nor. If set to true all values will be interpreted as is but if set to false string encoded numbers etc will be parsed to numbers etc. By default strict is set to false, and this setting is especially recommended to keep if you are using PHP.
     *
     * @type {boolean}
     */
    strict?: boolean
  }
}

interface ClerkProduct {
  id: string
  name: string
  description: string
  price: string
  list_price?: string
  image: string
  url: string
  categories: string[]
  /**
   * Unix timestamp for when the product was created.
   *
   * @type {number}
   * @memberOf ClerkProduct
   */
  created_at: number
}

interface ClerkCategory {
  id: string
  name: string
  url: string
  subcategories: string[]
}

interface ClerkOrder {
  id: string
  products: {
    id: string
    quantity: number
    price: number
  }
  /**
   * The time of the order as a Unix Timestamp.
   *
   * @type {number}
   * @memberOf ClerkOrder
   */
  time: number
  email: string
}

interface ClerkCustomer {
  id: string
  name: string
  email: string
}

interface ClerkPage {
  id: string
  type: string
  url: string
  title: string
  text: string
}

interface FeedStructure<FeedType> {
  data: FeedType[]
  createdAt: number
}

interface OrderFeed extends FeedStructure {
  ordersSince: string
  startedAt: number
}
