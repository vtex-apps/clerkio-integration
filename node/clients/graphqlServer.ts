import type { InstanceOptions, IOContext } from '@vtex/api'
import { AppClient, GraphQLClient } from '@vtex/api'

// export class ProductNotFound extends Error {
//   public graphQLErrors: any

//   constructor(graphQLErrors: any[]) {
//     super()
//     this.graphQLErrors = graphQLErrors
//   }
// }

// const handleNotFoundError = (error: any) => {
//   if (error.graphQLErrors && error.graphQLErrors.length === 1) {
//     const hasNotFounError = any(
//       (err: any) => err.message.startsWith('No product was found'),
//       error.graphQLErrors
//     )

//     if (hasNotFounError) {
//       throw new ProductNotFound(error.graphQLErrors)
//     }
//   }

//   throw error
// }

export default class GraphQLServer extends AppClient {
  protected graphql: GraphQLClient

  constructor(ctx: IOContext, options?: InstanceOptions) {
    super('vtex.graphql-server@1.x', ctx, options)
    this.graphql = new GraphQLClient(this.http)
  }

  public query = async (query: string) =>
    this.graphql
      .query(
        {
          extensions: {
            persistedQuery: {
              provider: 'vtex.search-graphql@0.x',
              sender: 'vtex.store-sitemap@2.x',
            },
          },
          query,
          variables: { query },
        },
        {
          params: {
            locale: this.context.locale,
          },
          url: '/graphql',
        }
      )
      .catch(err => err)
}
