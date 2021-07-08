export const pacer = (time: number) =>
  new Promise(resolve => setTimeout(resolve, time))

export const getAllSubcategoriesIds = (arr: CategoryTreeItem[]) =>
  arr.map(item => String(item.id))

export const extractAllProductIds = (products: ProductAndSkuIds['data']) =>
  Object.keys(products)

export const iterationLimits = (step: number) => [50 * step + 1, 50 * step + 50]
