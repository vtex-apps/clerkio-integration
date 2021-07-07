import {
  extractOrderList,
  generateDatePair,
  pacer,
  transformOrderToClerk,
} from '../utils'

export const generateOrderFeed = async (ctx: Context) => {
  const {
    clients: { orders, feedManager },
    vtex: { logger },
  } = ctx

  let feedStatus

  try {
    feedStatus = await feedManager.createFeedStatus('order')
  } catch (e) {
    logger.error({
      message: 'Error generating order feed status',
      date: new Date().toString(),
      error: e,
    })
  }

  if (!feedStatus) {
    return
  }

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

    const orderFeed = allOrders.map(transformOrderToClerk)

    await feedManager.saveOrderFeed({ orderFeed })

    const finishedAt = new Date().toString()

    const feedStatusUpdated = {
      ...feedStatus,
      ...{ finishedAt, entries: orderFeed.length },
    }

    await feedManager.updateFeedStatus(feedStatusUpdated)

    logger.info({
      message: 'Order feed generated successfully',
      date: finishedAt,
    })
  } catch (e) {
    const finishedAt = new Date().toString()

    const feedStatusUpdated = {
      ...feedStatus,
      ...{ finishedAt, error: true },
    }

    await feedManager.updateFeedStatus(feedStatusUpdated)

    logger.error({
      message: 'Error generating order feed',
      date: finishedAt,
      error: e,
    })
  }

  return 'generate orders'
}
