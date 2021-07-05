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

const ORDER_RANGE_DAYS = 10
const DAY_MS = 1000 * 60 * 60 * 24

function getDayRange(date: Date): string[] {
  const start = new Date(date.getTime())
  const end = new Date(date.getTime())

  end.setDate(start.getDate() - 1)

  return [`${end.toISOString()} TO ${start.toISOString()}`]
}

export function generateDatePair(): string[][] {
  const today = new Date()
  const pairs: string[][] = []

  for (let i = 0; i < ORDER_RANGE_DAYS; i++) {
    const currDate = new Date(today.getTime() - i * DAY_MS)

    pairs.push(getDayRange(currDate))
  }

  return pairs
}
