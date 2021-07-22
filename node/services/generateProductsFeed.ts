import {
  extractAllProductIds,
  formatBindings,
  iterationLimits,
  transformProductToClerk,
  pacer,
} from '../utils'

const SEARCH_GRAPHQL_APP = 'vtex.search-graphql@0.x'
const TENANT_GRAPHQL_APP = 'vtex.tenant-graphql@0.x'

const createProductsQuery = (
  productIds: string[],
  salesChannel: string
) => `query {
    productsByIdentifier (
      field: id
      values: [${productIds}]
      salesChannel: ${salesChannel}
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

const createBindingsQuery = `query {
    tenantInfo {
      bindings {
        defaultLocale
        targetProduct
        extraContext
      }
    }
  }`

export async function generateProductsFeed(ctx: Context) {
  const {
    clients: { catalog, feedManager, graphQLServer },
    vtex: { logger },
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

  let storeBindings

  try {
    const { data: tenantQuery } = await graphQLServer.query<TenantQuery>(
      createBindingsQuery,
      TENANT_GRAPHQL_APP
    )

    const {
      tenantInfo: { bindings },
    } = tenantQuery

    storeBindings = formatBindings(bindings)

    // eslint-disable-next-line no-console
    console.log('Bindings', storeBindings)
  } catch (error) {
    logger.error({
      message: 'Error getting store locales',
      date: new Date().toString(),
      error,
    })
  }

  if (!storeBindings) {
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

  for await (const binding of storeBindings) {
    const productQueriesPromises: Array<Promise<ProductsByIdentifierQuery>> = []
    const { id, locale, salesChannel } = binding

    for (const idsArray of productIdsArrays) {
      const query = createProductsQuery(idsArray, salesChannel)

      productQueriesPromises.push(
        graphQLServer.query(query, SEARCH_GRAPHQL_APP, locale)
      )
    }

    const feedStatusUpdated: FeedStatus = { ...feedStatus }
    const entries: ProductFeedEntries[] = []

    try {
      let products: ProductInfo[] = []

      for await (const productQuery of productQueriesPromises) {
        const { data } = productQuery

        if (data) {
          const { productsByIdentifier } = data

          products = products.concat(productsByIdentifier)
        }

        await pacer(200)
      }

      const productFeed = products.map(transformProductToClerk)

      await feedManager.saveProductFeed({ productFeed, id })

      entries.push({
        binding: id,
        entries: productFeed.length,
      })
    } catch (error) {
      const finishedAt = new Date().toString()

      entries.push({ binding: id, entries: 0 })
      feedStatusUpdated.error = true

      await feedManager.updateFeedStatus(feedStatusUpdated)

      logger.error({
        message: `Error generating products feed for binding with id ${id}`,
        date: finishedAt,
      })
    }

    feedStatusUpdated.entries = entries
    feedStatusUpdated.finishedAt = new Date().toString()

    await feedManager.updateFeedStatus(feedStatusUpdated)

    logger.info({
      message: 'Products feed generated',
      date: feedStatusUpdated.finishedAt,
    })
  }
}
