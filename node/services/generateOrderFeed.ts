import { generateDatePair } from '../utils'

export const generateOrderFeed = () => {
  const ordersDateRange = generateDatePair()

  // eslint-disable-next-line no-console
  console.log(ordersDateRange)

  return 'generate orders'
}
