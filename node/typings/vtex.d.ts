interface CategoryTreeItem {
  id: number
  name: string
  hasChildren: boolean
  url: string
  children: CategoryTreeItem[]
}

interface ProductAndSkuIds {
  data: {
    [key: string]: number[]
  }
  range: {
    total: number
    from: number
    to: number
  }
}

interface QueryProduct {
  productId: string
  productName: string
  description: string
  priceRange: {
    sellingPrice: PriceRange
    listPrice: PriceRange
  }
  items: Images[]
  link: string
  categoryTree: Category[]
  brand?: string
  releaseDate: number | null
}

interface PriceRange {
  highPrice: number
  lowPrice: number
}

interface Images {
  images: ImageUrl[]
}
interface ImageUrl {
  imageUrl: string
}

interface Category {
  id: number
}
interface OrderListResponse {
  list: OrderSummary[]
  paging: {
    total: number
    pages: number
  }
}

interface OrderSummary {
  orderId: string
  creationDate: string
  salesChannel: string
}

interface Order extends OrderSummary {
  items: Item[]
  clientProfileData: ClientProfileData
}

interface ClientProfileData {
  email: string
}

interface Item {
  id: string
  quantity: number
  sellingPrice: number
}
