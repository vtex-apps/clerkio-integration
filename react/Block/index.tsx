import React, { useEffect } from 'react'

import { DATA_CATEGORY, DATA_KEYWORDS, logicTypes } from './constants'
import { ensureSingleWordClass } from './utils'

interface BlockProps {
  blockClassName: string
  templateName: string
  contentLogic: typeof logicTypes[number]['type']
  categoryId?: string
  useContext?: boolean
  keywords?: Array<Record<'keyword', string>>
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

  useEffect(() => {
    const { Clerk } = window

    if (adjustedClassName && templateName && Clerk) {
      Clerk('content', `.${adjustedClassName}`)
    }
  }, [adjustedClassName, templateName])

  // eslint-disable-next-line no-console
  console.log({ contentLogic, categoryId, useContext, keywords })

  return adjustedClassName && templateName ? (
    <div>
      <h2>Clerk Io</h2>
      <span className={adjustedClassName} data-template={templateName} />
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
                .filter(({ prop }) => prop === DATA_CATEGORY)
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
                .filter(({ prop }) => prop === DATA_KEYWORDS)
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
