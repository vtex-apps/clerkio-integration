import React, { useEffect } from 'react'

import { logicTypes } from './constants'
import { ensureSingleWordClass } from './utils'

interface BlockProps {
  blockClassName: string
  templateName: string
  contentLogic: string
}

const ClerkIoBlock: StorefrontFunctionComponent<BlockProps> = ({
  blockClassName,
  templateName,
  contentLogic,
}) => {
  const adjustedClassName = ensureSingleWordClass(blockClassName)

  useEffect(() => {
    const { Clerk } = window

    if (adjustedClassName && templateName && Clerk) {
      Clerk('content', `.${adjustedClassName}`)
    }
  }, [adjustedClassName, templateName])

  // eslint-disable-next-line no-console
  console.log({ contentLogic })

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
      enum: logicTypes,
    },
  },
}

export default ClerkIoBlock
