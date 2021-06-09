// Clerk Props

export const DATA_CATEGORY = 'data-category'
export const DATA_PRODUCTS = 'data-products'
export const DATA_KEYWORDS = 'data-keywords'
export const DATA_EMAIL = 'data-email'

type DataProps =
  | typeof DATA_CATEGORY
  | typeof DATA_PRODUCTS
  | typeof DATA_KEYWORDS
  | typeof DATA_EMAIL

class ClerkProductLogic {
  public type: string
  public prop: DataProps | null

  constructor(type: string, prop: DataProps | null) {
    this.type = type
    this.prop = prop
  }
}

const BEST_SELLERS = new ClerkProductLogic('Best Sellers', null)
const HOT_PRODUCTS = new ClerkProductLogic('Hot Products', null)
const NEWEST_PRODUCTS = new ClerkProductLogic('Newest Products', null)
const BEST_SELLERS_IN_CATEGORY = new ClerkProductLogic(
  'Best Sellers In Category',
  DATA_CATEGORY
)

const HOT_PRODUCTS_IN_CATEGORY = new ClerkProductLogic(
  'Hot Products In Category',
  DATA_CATEGORY
)

const NEWEST_PRODUCTS_IN_CATEGORY = new ClerkProductLogic(
  'Newest Products in Category',
  DATA_CATEGORY
)

const BEST_ALTERNATIVE_PRODUCTS = new ClerkProductLogic(
  'Best Alternative Products',
  DATA_PRODUCTS
)

const BEST_CROSS_SELL_PRODUTS = new ClerkProductLogic(
  'Best Cross-Sell Produts',
  DATA_PRODUCTS
)

const RECOMMENDATIONS_BASED_ON_KEYWORDS = new ClerkProductLogic(
  'Recommendations Based On Keywords',
  DATA_KEYWORDS
)

const VISITOR_RECOMMENDATIONS = new ClerkProductLogic(
  'Visitor Recommendations',
  null
)

const VISITOR_ALTERNATIVES = new ClerkProductLogic('Visitor Alternatives', null)
const VISITOR_CLICK_HISTORY = new ClerkProductLogic(
  'Visitor Click History',
  null
)

const RECOMMENDATIONS_BASED_ON_ORDERS = new ClerkProductLogic(
  'Recommendations Based On Orders',
  DATA_EMAIL
)

const SIMILAR_TO_ORDER_HISTORY = new ClerkProductLogic(
  'Similar To Order History',
  DATA_EMAIL
)

const CUSTOMER_ORDER_HISTORY = new ClerkProductLogic(
  'Customer Order History',
  DATA_EMAIL
)

const WHAT_CUSTOMERS_LOOK_AT_RIGHT_NOW = new ClerkProductLogic(
  'What Customers Look At Right Now',
  null
)

const RECENTLY_PURCHASED_PRODUCTS = new ClerkProductLogic(
  'Recently Purchased Products',
  DATA_EMAIL
)

export const logicTypes = [
  BEST_SELLERS,
  HOT_PRODUCTS,
  NEWEST_PRODUCTS,
  BEST_SELLERS_IN_CATEGORY,
  HOT_PRODUCTS_IN_CATEGORY,
  NEWEST_PRODUCTS_IN_CATEGORY,
  BEST_ALTERNATIVE_PRODUCTS,
  BEST_CROSS_SELL_PRODUTS,
  RECOMMENDATIONS_BASED_ON_KEYWORDS,
  VISITOR_RECOMMENDATIONS,
  VISITOR_ALTERNATIVES,
  VISITOR_CLICK_HISTORY,
  RECOMMENDATIONS_BASED_ON_ORDERS,
  SIMILAR_TO_ORDER_HISTORY,
  CUSTOMER_ORDER_HISTORY,
  WHAT_CUSTOMERS_LOOK_AT_RIGHT_NOW,
  RECENTLY_PURCHASED_PRODUCTS,
] as const
