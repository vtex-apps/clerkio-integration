import {
  extractAllProductIds,
  iterationLimits,
  transformProductToClerk,
} from '../utils'

export async function generateProductsFeed(ctx: Context) {
  const {
    clients: { catalog, feedManager, searchGQL },
    vtex: { logger },
  } = ctx

  let feedStatus

  try {
    feedStatus = await feedManager.createFeedStatus('product')
  } catch (e) {
    logger.error({
      message: 'Error generating product feed status',
      date: new Date().toString(),
      error: e,
    })
  }

  if (!feedStatus) {
    return
  }

  let totalProducts

  try {
    const {
      range: { total },
    } = await catalog.getProductAndSkuIds(1, 50)

    totalProducts = total
  } catch (error) {
    logger.error({
      message: 'Error obtaining product and sku ids.',
      date: new Date().toString(),
      error,
    })
  }

  if (!totalProducts) {
    return
  }

  const iterations = Math.ceil(totalProducts / 50)
  const productAndSkuIdsPromises = []

  for (let i = 0; i < iterations; i++) {
    const [from, to] = iterationLimits(i)

    productAndSkuIdsPromises.push(catalog.getProductAndSkuIds(from, to))
  }

  let productAndSkuIds

  try {
    productAndSkuIds = await Promise.all(productAndSkuIdsPromises)
  } catch (error) {
    logger.error({
      message: 'Error resolving getProductAndSkuIds requests.',
      date: new Date().toString(),
      error,
    })
  }

  if (!productAndSkuIds) {
    return
  }

  const productIdsArrays = []

  for (const response of productAndSkuIds) {
    const { data } = response

    productIdsArrays.push(extractAllProductIds(data))
  }

  const productQueriesPromises: any[] = []

  for (const idsArray of productIdsArrays) {
    const query = createProductsQuery(idsArray)

    productQueriesPromises.push(searchGQL.query(query))
  }

  let productQueries

  try {
    productQueries = await Promise.all(productQueriesPromises)
  } catch (error) {
    logger.error({
      message: 'Error resolving product queries.',
      date: new Date().toString(),
      error,
    })
  }

  if (!productQueries) {
    return
  }

  let products: QueryProduct[] = []

  for (const productQuery of productQueries) {
    if (productQuery.data) {
      const { data }: { data?: any } = productQuery
      const {
        productsByIdentifier,
      }: { productsByIdentifier: QueryProduct } = data

      products = products.concat(productsByIdentifier)
    }
  }

  const feedProducts = products.map(transformProductToClerk)

  // eslint-disable-next-line no-console
  console.log(
    'FeedProducts',
    feedProducts.length ? feedProducts.length : 'Nooo'
  )
  // feedManager.saveProductFeed({
  //   productFeed: feedProducts,
  //   locale: 'es_ES',
  // })
}

function createProductsQuery(productIds: string[]) {
  return `query {
    productsByIdentifier (
      field: id
      values: [${productIds}]
    ) {
      productId
      productName
      description
      priceRange {
        sellingPrice {
          highPrice
          lowPrice
        }
        listPrice {
          highPrice
          lowPrice
        }
      }
      items {
        images {
          imageUrl
        }
      }
      link
      categoryTree {
        id
      }
      brand
      releaseDate
    }
  }`
}
