interface ClerkFeed {
  products: ClerkProduct[]
  categories: ClerkCategory[]
  orders?: ClerkOrder[]
  customers?: ClerkCustomer[]
  pages?: ClerkPage[]
  config?: {
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
  price: number
  list_price?: number
  image: string
  url: string
  categories: number[]
  brand?: string
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
  description?: string
}

interface ClerkOrder {
  id: string
  products: Array<{
    id: string
    quantity: number
    price: number
  }>
  /**
   * The time of the order as a Unix Timestamp.
   *
   * @type {number}
   * @memberOf ClerkOrder
   */
  time: number
  email: string
  salesChannel?: string
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

interface FeedStructure<FeedDataType> {
  data: FeedDataType[]
  createdAt: number
}

type OrderIntegrationControl = Record<string, number>

interface IntegrationInfo {
  bindingId: string
  /**
   * The time when orders were integrated as a Unix Timestamp
   *
   * @type {number}
   * @memberOf IntegrationInfo
   */
  orderIntegratedAt: number
  /**
   * Number of products integrated
   *
   * @type {number}
   * @memberOf IntegrationInfo
   */
  products: number
  /**
   * Number of categories integrated
   *
   * @type {number}
   * @memberOf IntegrationInfo
   */
  categories: number
  integratedAt: number
}

interface IntegrationInfoInput {
  /**
   * The time when orders were integrated as a Unix Timestamp
   *
   * @type {number}
   * @memberOf IntegrationInfo
   */
  orderIntegratedAt: number
  /**
   * Number of products integrated
   *
   * @type {number}
   * @memberOf IntegrationInfo
   */
  products: number
  /**
   * Number of categories integrated
   *
   * @type {number}
   * @memberOf IntegrationInfo
   */
  categories: number
  bindingId: string
}
