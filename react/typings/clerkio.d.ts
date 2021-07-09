interface ClerkOrderAPI {
  sale: string
  products: Array<{
    id: string
    quantity: number
    price: number
  }>
  email: string
}
