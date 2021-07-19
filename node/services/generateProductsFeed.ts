import {
  extractAllProductIds,
  extractLocales,
  iterationLimits,
  transformProductToClerk,
  pacer,
} from '../utils'

const SEARCH_GRAPHQL_APP = 'vtex.search-graphql@0.x'
const TENANT_GRAPHQL_APP = 'vtex.tenant-graphql@0.x'

const createProductsQuery = (productIds: string[]) => `query {
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

const createBindingsQuery = `query {
    tenantInfo {
      bindings {
        defaultLocale
        targetProduct
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

  let locales

  try {
    const { data: tenantQuery } = (await graphQLServer.query(
      createBindingsQuery,
      TENANT_GRAPHQL_APP
    )) as TenantQuery

    const {
      tenantInfo: { bindings },
    } = tenantQuery

    locales = extractLocales(bindings)
  } catch (error) {
    logger.error({
      message: 'Error getting store locales',
      date: new Date().toString(),
      error,
    })
  }

  if (!locales) {
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

  for await (const locale of locales) {
    const productQueriesPromises: any[] = []

    for (const idsArray of productIdsArrays) {
      const query = createProductsQuery(idsArray)

      productQueriesPromises.push(
        graphQLServer.query(query, SEARCH_GRAPHQL_APP, locale)
      )
    }

    try {
      let products: ProductInfo[] = []

      for await (const productQuery of productQueriesPromises) {
        const { data } = (await productQuery) as ProductsByIdentifierQuery

        if (data) {
          const { productsByIdentifier } = data

          products = products.concat(productsByIdentifier)
        }

        pacer(200)
      }

      const productFeed = products.map(transformProductToClerk)

      await feedManager.saveProductFeed({ productFeed, locale })

      const finishedAt = new Date().toString()

      const feedStatusUpdated = {
        ...feedStatus,
        ...{ finishedAt, entries: productFeed.length },
      }

      await feedManager.updateFeedStatus(feedStatusUpdated)

      logger.info({
        message: 'Products feed generated successfully',
        date: finishedAt,
      })
    } catch (error) {
      const finishedAt = new Date().toString()

      const feedStatusUpdated = {
        ...feedStatus,
        ...{ finishedAt, error: true },
      }

      await feedManager.updateFeedStatus(feedStatusUpdated)

      logger.error({
        message: 'Error generating products feed',
        date: finishedAt,
      })
    }
  }
}
