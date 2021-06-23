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
