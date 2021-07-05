interface CategoryTreeItem {
  id: number
  name: string
  hasChildren: boolean
  url: string
  children: CategoryTreeItem[]
}

interface AppConfig {
  bindingBounded: boolean
  settings: BindingAppConfig[]
}

interface BindingAppConfig {
  bindingId: string
  clerkioToken: string
  salesChannel: string
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
