import { UserInputError } from '@vtex/api'

export function getAllSubcategoriesIds(arr: CategoryTreeItem[]) {
  return arr.map(item => String(item.id))
}

export function extractAllProductIds(products: ProductAndSkuIds['data']) {
  return Object.keys(products)
}

export function iterationLimits(step: number) {
  return [50 * step + 1, 50 * step + 50]
}

export function validateAppSettings(appConfig: AppConfig): boolean | void {
  if (!appConfig.bindingBounded) {
    throw new UserInputError('App needs to be binding bounded')
  }

  for (const setting of appConfig.settings) {
    if (!setting.bindingId) {
      throw new UserInputError(
        'Missing bindingId for one or more configuration'
      )
    }

    if (!setting.clerkioToken) {
      throw new UserInputError(
        'Missing Clerk.Io Token for one or more configuration'
      )
    }

    if (!setting.salesChannel) {
      throw new UserInputError(
        'Missing Sales Channel for one or more configuration'
      )
    }

    if (!setting.defaultLocale) {
      throw new UserInputError(
        'Missing Default Locale for one or more configuration'
      )
    }
  }
}

const ORDER_RANGE_DAYS = 90
const DAY_MS = 1000 * 60 * 60 * 24

function getDayRange(date: Date): string {
  const start = new Date(date.getTime())
  const end = new Date(date.getTime())

  end.setDate(start.getDate() - 1)

  return `${end.toISOString()} TO ${start.toISOString()}`
}

export function generateDatePair(): string[] {
  const today = new Date()
  const pairs: string[] = []

  for (let i = 0; i < ORDER_RANGE_DAYS; i++) {
    const currDate = new Date(today.getTime() - i * DAY_MS)

    pairs.push(getDayRange(currDate))
  }

  return pairs
}

export function createListOrderParams({
  creationDate,
  page = 1,
}: ListOrderParams) {
  return {
    f_creationDate: `creationDate:[${creationDate}]`,
    page,
    per_page: 100,
  }
}

export function extractOrderList(...args: OrderListResponse[]) {
  return args.reduce<OrderSummary[]>((acc, cur) => {
    return [...acc, ...cur.list]
  }, [])
}

const CONVERSATION_TRACKER = '.ct.vtex.com.br'

function normalizeEmailSoftEncrypt(email: string): string {
  const splitted = email.split(CONVERSATION_TRACKER)

  if (splitted.length < 2) {
    return email
  }

  const [emailWithDash] = splitted
  const i = emailWithDash.lastIndexOf('-')

  return emailWithDash.slice(0, i)
}

export function transformOrderToClerk(orderDetails: Order): ClerkOrder {
  return {
    id: orderDetails.orderId,
    // Clerk asks the dates to be a UNIX timestamp (in seconds)
    // .getTime generates it in miliseconds
    time: Math.floor(new Date(orderDetails.creationDate).getTime() / 1000),
    email: normalizeEmailSoftEncrypt(orderDetails.clientProfileData.email),
    salesChannel: orderDetails.salesChannel,
    products: orderDetails.items.map(item => {
      return {
        id: item.id,
        price: item.sellingPrice / 100,
        quantity: item.quantity,
      }
    }),
  }
}

export function getBindingSalesChannel(
  bindings: BindingAppConfig[],
  bindingId: string
): string {
  const [currentBinding] = bindings.filter(
    binding => binding.bindingId === bindingId
  )

  const { salesChannel } = currentBinding

  return salesChannel
}

export function transformProductToClerk(
  product: ProductInfo,
  rootPath?: string
): ClerkProduct | undefined {
  const { sellingPrice, listPrice } = product.priceRange

  if (!sellingPrice.highPrice && !listPrice.highPrice) {
    return
  }

  const dateString = product.releaseDate ?? new Date()
  // Clerk asks the dates to be a UNIX timestamp (in seconds)
  // .getTime generates it in miliseconds
  const date = Math.floor(new Date(dateString).getTime() / 1000)

  const productUrl = rootPath
    ? `/${rootPath}/${product.linkText}/p`
    : `/${product.linkText}/p`

  return {
    id: product.productId,
    name: product.productName,
    description: product.description,
    price: sellingPrice.highPrice,
    list_price: listPrice.highPrice,
    image: product.items[0].images[0].imageUrl,
    url: productUrl,
    categories: product.categoryTree.map(category => category.id),
    brand: product.brand,
    created_at: date,
  }
}

export function transformCategoriesToClerk(
  categoryTree: CategoryTreeItem[],
  hostname: string
) {
  return categoryTree.reduce(
    (result: ClerkCategory[], currentItem: CategoryTreeItem) => {
      const { id, name, url } = currentItem
      const category: ClerkCategory = {
        id: String(id),
        name,
        subcategories: [],
        url: url.replace('portal.vtexcommercestable.com.br', hostname),
      }

      result.push(category)

      if (currentItem.hasChildren) {
        result[result.length - 1].subcategories = getAllSubcategoriesIds(
          currentItem.children
        )

        result = result.concat(
          transformCategoriesToClerk(currentItem.children, hostname)
        )
      }

      return result
    },
    []
  )
}

const ONE_MINUTE = 60 * 1000

export function pacer(callsPerMinute: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('done')
    }, ONE_MINUTE / callsPerMinute)
  })
}

const TWO_HOURS = 2 * 60 * 60 * 1000

export function feedInProgress(feedStatus: FeedStatus): boolean {
  const startDate = feedStatus.startedAt as string
  const finishDate = feedStatus.finishedAt as string

  const startedAt = new Date(startDate).getTime()
  const finishedAt = new Date(finishDate).getTime()
  const currentTime = new Date().getTime()

  if (!finishedAt && currentTime - startedAt < TWO_HOURS) {
    return true
  }

  return false
}

export const SEARCH_GRAPHQL_APP = 'vtex.search-graphql@0.x'
