import { logicTypes } from './constants'

export const ensureSingleWordClass = (
  className: string | undefined
): string | undefined => {
  return className?.split(' ').join('-')
}

interface DataPropsArgs {
  contentLogic: typeof logicTypes[number]['type']
  values: {
    categoryId?: string
    keywords?: string[]
    userEmail?: string
    productIds?: string[]
  }
}

export const createClerkDataProps = ({
  contentLogic,
  values,
}: DataPropsArgs) => {
  const { prop } = logicTypes.find(({ type }) => contentLogic === type) ?? {}

  return prop ? { [prop.propName]: values[prop.propField] } : {}
}
