import {
  extractOrderList,
  generateDatePair,
  pacer,
  transformOrderToClerk,
} from '../utils'

export const generateOrderFeed = async (ctx: Context) => {
  const {
    clients: { orders },
    // vtex: { logger },
  } = ctx

  try {
    const ordersDateRange = generateDatePair()

    const orderListPromiseColletion = []

    // Here, we get only the first page of each day.
    for (const rangeDate of ordersDateRange) {
      const orderListPromise = orders.listorders({
        creationDate: rangeDate,
      })

      orderListPromiseColletion.push(orderListPromise)
      // eslint-disable-next-line no-await-in-loop
      await pacer()
    }

    const ordersCollection = await Promise.all(orderListPromiseColletion)

    const remainingPagesPromises = []

    // Loop to get the remaining pages for order list
    for (let i = 0; i < ordersCollection.length; i++) {
      const {
        paging: { pages },
      } = ordersCollection[i]

      const rangeDate = ordersDateRange[i]

      for (let page = 2; page <= pages; page++) {
        const orderListPromise = orders.listorders({
          creationDate: rangeDate,
          page,
        })

        remainingPagesPromises.push(orderListPromise)

        // eslint-disable-next-line no-await-in-loop
        await pacer()
      }
    }

    const remainingPages = await Promise.all(remainingPagesPromises)

    const extractedOrders = extractOrderList(
      ...ordersCollection,
      ...remainingPages
    )

    const orderDetailedPromises = []

    for (const { orderId } of extractedOrders) {
      const orderDetailPromise = orders.order(orderId)

      orderDetailedPromises.push(orderDetailPromise)

      // eslint-disable-next-line no-await-in-loop
      await pacer()
    }

    const allOrders = await Promise.all(orderDetailedPromises)

    const orderFeedData = allOrders.map(transformOrderToClerk)

    // eslint-disable-next-line no-console
    console.log({ allOrders: orderFeedData.length })

    // logger.info({
    //   message: 'Order feed generated successfully',
    //   date: new Date(),
    // })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log({ e })
  }

  return 'generate orders'
}
