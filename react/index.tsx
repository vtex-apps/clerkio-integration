import { canUseDOM } from 'vtex.render-runtime'

import type { PixelMessage } from './typings/events'

export function handleEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    case 'vtex:orderPlaced': {
      const sc = document.createElement('span')
      const {
        ordersInOrderGroup: [orderId],
        visitorContactInfo: [customerEmail],
        transactionProducts,
      } = e.data

      const products = transactionProducts.map(product => {
        const { id, quantity, price } = product

        return {
          id,
          quantity,
          price,
        }
      })

      sc.classList.add('clerk')
      sc.setAttribute('data-api', 'log/sale')
      sc.setAttribute('data-sale', orderId)
      sc.setAttribute('data-email', customerEmail)
      sc.setAttribute('data-products', JSON.stringify(products))

      document.body.appendChild(sc)

      break
    }

    default: {
      break
    }
  }
}

if (canUseDOM) {
  window.addEventListener('message', handleEvents)
}
