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
