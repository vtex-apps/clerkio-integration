import { UserInputError } from '@vtex/api'

export function prepareFeedCategories(
  arr: CategoryTreeItem[],
  hostname: string
) {
  return arr.reduce(
    (result: ClerkCategory[], currentItem: CategoryTreeItem) => {
      const { id, name, url } = currentItem
      const category: ClerkCategory = {
        id: String(id),
        name,
        subcategories: [],
        url: url.replace('portal.vtexcommercestable.com.br', hostname),
      }

      result.push(category)

      if (currentItem.hasChildren) {
        result[result.length - 1].subcategories = getAllSubcategoriesIds(
          currentItem.children
        )

        result = result.concat(
          prepareFeedCategories(currentItem.children, hostname)
        )
      }

      return result
    },
    []
  )
}

function getAllSubcategoriesIds(arr: CategoryTreeItem[]) {
  return arr.map(item => String(item.id))
}

export function validateAppSettings(appConfig: AppConfig): boolean | void {
  if (!appConfig.bindingBounded) {
    throw new UserInputError('App needs to be binding bounded')
  }

  for (const setting of appConfig.settings) {
    if (!setting.bindingId) {
      throw new UserInputError(
        'Missing bindingId for one or more configuration'
      )
    }

    if (!setting.clerkioToken) {
      throw new UserInputError(
        'Missing Clerk.Io Token for one or more configuration'
      )
    }

    if (!setting.salesChannel) {
      throw new UserInputError(
        'Missing Sales Channel for one or more configuration'
      )
    }
  }
}
