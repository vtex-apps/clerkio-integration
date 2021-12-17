import {
  extractAllProductIds,
  iterationLimits,
  transformProductToClerk,
  pacer,
  SEARCH_GRAPHQL_APP,
} from '../utils'

const createProductsQuery = (
  productIds: string[],
  salesChannel: string
) => `query {
    productsByIdentifier(field: id, values: [${productIds}], salesChannel: "${salesChannel}") {
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
      linkText
      categoryTree {
        id
      }
      brand
      releaseDate
    }
  }`

export async function generateProductsFeed(ctx: Context) {
  const {
    clients: { catalog, feedManager, graphQLServer },
    vtex: { logger },
    state: {
      appConfig: { settings: storeBindings },
    },
  } = ctx

  let feedStatus

  try {
    feedStatus = await feedManager.createFeedStatus('product')
  } catch (error) {
    logger.error({
      message: 'Error generating product feed status',
      date: new Date().toString(),
      error,
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

  const feedStatusUpdated: FeedStatus = { ...feedStatus }
  const entries: ProductFeedEntries[] = []

  for await (const binding of storeBindings) {
    const productQueriesPromises: Array<Promise<ProductsByIdentifierQuery>> = []
    const { bindingId, defaultLocale, salesChannel, rootPath } = binding

    for await (const idsArray of productIdsArrays) {
      const query = createProductsQuery(idsArray, salesChannel)

      productQueriesPromises.push(
        graphQLServer.query(query, SEARCH_GRAPHQL_APP, {
          locale: defaultLocale,
          bindingId,
        })
      )

      await pacer(1000)
    }

    try {
      const productQueries = await Promise.all(productQueriesPromises)

      let products: ProductInfo[] = []

      for await (const productQuery of productQueries) {
        const { data } = productQuery

        if (data) {
          const { productsByIdentifier } = data

          products = products.concat(productsByIdentifier)
        }

        await pacer(1000)
      }

      const productFeed = products
        .map(product => transformProductToClerk(product, rootPath))
        // Filter undefined products returned from the previous map function
        .filter(product => product) as ClerkProduct[]

      await feedManager.saveProductFeed({ productFeed, bindingId })

      entries.push({
        binding: bindingId,
        entries: productFeed.length,
      })

      logger.info({
        message: `Products feed generated for binding with id ${bindingId}`,
        date: feedStatusUpdated.finishedAt,
      })
    } catch (error) {
      const finishedAt = new Date().toString()

      entries.push({ binding: bindingId, entries: 0 })
      feedStatusUpdated.error = true

      await feedManager.updateFeedStatus(feedStatusUpdated)

      logger.error({
        message: `Error generating products feed for binding with id ${bindingId}`,
        date: finishedAt,
      })
    }
  }

  feedStatusUpdated.entries = entries
  feedStatusUpdated.finishedAt = new Date().toString()

  await feedManager.updateFeedStatus(feedStatusUpdated)

  logger.info({
    message: 'Products feed generated',
    date: feedStatusUpdated.finishedAt,
  })
}
