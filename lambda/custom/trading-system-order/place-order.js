const uuidv4 = require('uuid/v4')
const backend = require('./backend')

const createOrderObj = (orderInfo) => {
  const creationTime = Date.now()
  const custOrderId = uuidv4()
  const price = (orderInfo.type == 'MARKET')
    ? orderInfo.price
    : null
  orderInfo.instrument.attributes = ["java.util.TreeMap",{}]

  return (
    {
      id: null,
      state: null,
      type: orderInfo.type,
      offset: null,
      side: orderInfo.side.toUpperCase(),
      notes: null,
      companyId: orderInfo.companyId,
      ownerId: orderInfo.userId,
      creationTime,
      quantity: orderInfo.quantity,
      instrument: orderInfo.instrument,
      relatedOrderId: 0,
      accountId: orderInfo.accountId,
      destinationId: orderInfo.destinationId,
      expireTime: 0,
      market: orderInfo.instrument.exchangeid,
      orderId: null,
      price,
      ticketId: null,
      tif: orderInfo.tif,
      dispQty: 0,
      stopPrice: null,
      lastState: null,
      capacity: 'AGENCY',
      cpOrderId: null,
      avgprice: null,
      cumqty: 0,
      leavesqty: 0,
      aon: false,
      custOrderId,
      execInst: null,
      relatedClOrdId: null,
      quoteId: null
    }
  )
}

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function containsOrderFilledMsg(apiResponse, custOrderId) {
  let found = false

  apiResponse.emsgs.forEach(msg => {
    const execType = 'com.tradedesksoftware.ets.events.ETSExecutionEvent'
    if(msg.eventtype == execType) {
      if(msg.order.custOrderId == custOrderId) {
        if(msg.execution.finalState == 'FILLED') {
          //console.log(msg)
          orderInfo.price = msg.execution.avgPrice
          found = true
        }
      }
    }
  })

  return found
}

async function placeOrder(orderInfo) {
  let apiResponse
  let orderFilled = false
  
  const o = createOrderObj(orderInfo)

  try {

    await backend.doLogin()
    await backend.placeOrder(o)
  
    await backend.setMessageType()
    for(let i=1; i<=5; i++) {
      await wait(500)
      apiResponse = await backend.getMessages()
      if( containsOrderFilledMsg(apiResponse, o.custOrderId) ) {
        orderFilled = true
        break
      }
    }
  
    return orderInfo
  
  } catch(err) {
    return false
  } 
}

module.exports = placeOrder
