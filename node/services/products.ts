import { extractAllProductIds, iterationLimits } from '../utils'

export async function prepareFeedProducts(ctx: Context) {
  const {
    clients: { catalog, searchGQL },
  } = ctx

  const {
    range: { total: totalProducts },
  } = await catalog.getProductAndSkuIds(1, 50)

  const iterations = Math.ceil(totalProducts / 50)
  const productAndSkuIdsPromises = []

  for (let i = 0; i < iterations; i++) {
    const [from, to] = iterationLimits(i)

    productAndSkuIdsPromises.push(catalog.getProductAndSkuIds(from, to))
  }

  const productAndSkuIds = await Promise.all(productAndSkuIdsPromises)
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

  const productQueries = await Promise.all(productQueriesPromises)
  let products: QueryProduct[] = []

  for await (const productQuery of productQueries) {
    if (productQuery.data) {
      const { data }: { data?: any } = productQuery
      const {
        productsByIdentifier,
      }: { productsByIdentifier: QueryProduct } = data

      products = products.concat(productsByIdentifier)
    }
  }

  const feedProducts = products.map(product => {
    const dateString = product.releaseDate ?? new Date()
    const date = new Date(dateString).getTime()

    return {
      id: product.productId,
      name: product.productName,
      description: product.description,
      price:
        product.priceRange.sellingPrice.highPrice ??
        product.priceRange.sellingPrice.lowPrice,
      list_price:
        product.priceRange.listPrice.highPrice ??
        product.priceRange.listPrice.lowPrice,
      image: product.items[0].images[0].imageUrl,
      url: product.link,
      categories: product.categoryTree.map(category => category.id),
      brand: product.brand,
      created_at: date,
    }
  })

  // eslint-disable-next-line no-console
  console.log('Prods', feedProducts.length, productIdsArrays.length)
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
