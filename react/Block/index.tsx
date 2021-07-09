import React, { useEffect } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { session } from 'vtex.store-resources/Queries'
import { useQuery } from 'react-apollo'

import { DATA_CATEGORY, DATA_KEYWORDS, logicTypes } from './constants'
import {
  createClerkDataProps,
  ensureSingleWordClass,
  getCategoryIdFromContext,
  getProductIdFromContext,
} from './utils'

interface BlockProps {
  blockClassName: string
  templateName: string
  contentLogic: typeof logicTypes[number]['type']
  categoryId?: string
  useContext?: boolean
  keywords?: Array<Record<'keyword', string>>
}

interface Session {
  getSession: {
    profile: {
      email: string
    } | null
  }
}

const ClerkIoBlock: StorefrontFunctionComponent<BlockProps> = ({
  blockClassName,
  templateName,
  contentLogic,
  categoryId,
  useContext,
  keywords,
}) => {
  const adjustedClassName = ensureSingleWordClass(blockClassName)

  const {
    route: {
      pageContext: { type, id },
    },
  } = useRuntime()

  const { data, loading } = useQuery<Session>(session, {
    ssr: false,
  })

  useEffect(() => {
    const { Clerk } = window

    if (adjustedClassName && templateName && Clerk && !loading) {
      Clerk('content', `.${adjustedClassName}`)
    }
  }, [adjustedClassName, templateName, loading])

  const dataProps = createClerkDataProps({
    contentLogic,
    values: {
      keywords: keywords?.map(({ keyword }) => keyword),
      categoryId: useContext
        ? getCategoryIdFromContext({ type, id })
        : categoryId,
      userEmail: data?.getSession.profile?.email ?? '',
      productIds: `[${getProductIdFromContext({ type, id })}]`,
    },
  })

  return adjustedClassName && templateName ? (
    <div>
      <span
        className={adjustedClassName}
        data-template={templateName}
        {...dataProps}
      />
    </div>
  ) : null
}

ClerkIoBlock.schema = {
  title: 'admin/cms/clerkio.title',
  description: 'admin/cms/clerkio.description',
  type: 'object',
  properties: {
    blockClassName: {
      title: 'admin/cms/clerkio.block.class.name',
      description: 'admin/cms/clerkio.block.class.description',
      type: 'string',
      default: null,
    },
    templateName: {
      title: 'admin/cms/clerkio.block.template.name',
      description: 'admin/cms/clerkio.block.template.description',
      type: 'string',
      default: null,
    },
    contentLogic: {
      title: 'admin/cms/clerkio.block.logic.name',
      type: 'string',
      enum: logicTypes.map(({ type }) => type),
    },
  },
  dependencies: {
    contentLogic: {
      oneOf: [
        {
          properties: {
            contentLogic: {
              enum: logicTypes
                .filter(({ prop }) => prop?.propName === DATA_CATEGORY.propName)
                .map(({ type }) => type),
            },
            useContext: {
              type: 'boolean',
              title: 'admin/cms/clerkio.block.logic.category.useContext',
              default: true,
            },
          },
          dependencies: {
            useContext: {
              oneOf: [
                {
                  properties: {
                    useContext: {
                      enum: [false],
                    },
                    categoryId: {
                      type: 'string',
                      title: 'admin/cms/clerkio.block.logic.category.id',
                    },
                  },
                },
              ],
            },
          },
        },
        {
          properties: {
            contentLogic: {
              enum: logicTypes
                .filter(({ prop }) => prop?.propName === DATA_KEYWORDS.propName)
                .map(({ type }) => type),
            },
            keywords: {
              minItems: 0,
              type: 'array',
              title: 'admin/cms/clerkio.block.logic.keywords',
              items: {
                properties: {
                  keyword: {
                    type: 'string',
                    title: 'admin/cms/clerkio.block.logic.keyword',
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
}

export default ClerkIoBlock
