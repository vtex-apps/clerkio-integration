import type { InstanceOptions, IOContext } from '@vtex/api'
import { AppClient, GraphQLClient } from '@vtex/api'
import type { GraphQLResponse } from '@vtex/api/lib/service/worker/runtime/graphql/typings'

export default class SearchGQL extends AppClient {
  protected graphql: GraphQLClient

  constructor(ctx: IOContext, options?: InstanceOptions) {
    super('vtex.graphql-server@1.x', ctx, options)
    this.graphql = new GraphQLClient(this.http)
  }

  public query = async (query: string): Promise<GraphQLResponse> => {
    return this.graphql
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
}
