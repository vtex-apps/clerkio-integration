import type { InstanceOptions, IOContext } from '@vtex/api'
import { AppGraphQLClient } from '@vtex/api'

// const SEARCH_GRAPHQL_APP = 'vtex.search-graphql@0.x'

const PRODUCTS_QUERY = `
query {
  products(query:"") @context(provider: "vtex.search-graphql") {
    categoryId
    productId
    productName
  }
}`

export default class SearchGQL extends AppGraphQLClient {
  constructor(ctx: IOContext, opts?: InstanceOptions) {
    super('vtex.search-graphql@0.x', ctx, {
      ...opts,
      headers: {
        'x-vtex-locale': 'en-EN',
      },
    })
  }

  public getProducts = async (query: string) => {
    return this.graphql
      .query<any, any>(
        {
          query: PRODUCTS_QUERY,
          variables: { query },
          extensions: {
            persistedQuery: {
              provider: 'vtex.search-graphql@0.x',
              sender: 'vtex.store-sitemap@2.x',
            },
          },
        },
        {
          params: {
            locale: this.context.locale,
          },
          url: '/graphql',
        }
      )
      .then(res => {
        // eslint-disable-next-line no-console
        console.log('res', res)

        return res
      })
      .catch(res => res.graphQLErrors)
  }
}
