const placeOrder = require('./place-order')

const orderInfo = {
  type: 'MARKET',
  side: 'BUY',
  companyId: 1,
  ownerId: 3,
  quantity: 1000,
  instrument: {
    attributes: ['java.util.TreeMap',{}],
    baseSymbol: 'ETHUSD',
    exchangeid: 2,
    id: 5,
    symbol: 'ETHUSD',
    type: 'FOREIGNEXCHANGE',
    underlyingid: 0
  },
  accountId: 2,
  destinationId: 2,
  market: 2,
  price: null,
  tif: 'DAY'
}

placeOrder(orderInfo)
  .then(console.log)
