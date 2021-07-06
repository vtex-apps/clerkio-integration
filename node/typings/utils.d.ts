interface AppConfig {
  bindingBounded: boolean
  settings: BindingAppConfig[]
}

interface BindingAppConfig {
  bindingId: string
  clerkioToken: string
  salesChannel: string
}

interface ListOrderParams {
  creationDate: string
  page?: number
}
