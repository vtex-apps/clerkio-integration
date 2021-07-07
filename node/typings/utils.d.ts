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

type FeedType = 'order' | 'product' | 'category'

interface FeedStatus {
  startedAt?: string
  type: FeedType
  finishedAt?: string
  entries?: number
  error?: boolean
}
