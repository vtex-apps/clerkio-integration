export function flattenArray(arr: CategoryTreeItem[]) {
  return arr.reduce(
    (result: ClerkCategory[], currentItem: CategoryTreeItem) => {
      const { id, name, url } = currentItem
      const category: ClerkCategory = {
        id: String(id),
        name,
        subcategories: [],
        url,
      }

      result.push(category)

      if (currentItem.hasChildren) {
        result[result.length - 1].subcategories = getAllSubcategoriesIds(
          currentItem.children
        )

        result = result.concat(flattenArray(currentItem.children))
      }

      return result
    },
    []
  )
}

function getAllSubcategoriesIds(arr: CategoryTreeItem[]) {
  return arr.map(item => String(item.id))
}
