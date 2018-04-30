for (let i =0; i<portfolio.positions.length; i++) {
    if (order.symobl == portfolio.positions[i].sym) {              
      idx = i
    } else {
      idx = -1 
    }
  }

  if (((idx == -1) || (order.qty > portfolio.positions[idx])) && (order.side == 'sell')) {
    order.state = "not been filled, No shorting allowed"
    portfolio.positions.orders.push(order)
  }

  if ((order.side == 'buy') && (portfolio.balance <= 0)) {
    order.state = "not been filled, insufficient funds"
    portfolio.positions.orders.push(order)
  }

  getQuote(order.symbol)

    .then(quote => {
      let reportPrice = parseInt(quote.last_price,10)
      
      if ((order.side=='sell') && (portfolio.position[].qty > order.qty )) {
        portfolio.positions[idx].qty -= order.qty
        portfolio.balance += reportPrice * order.qty
        order.state = 'filled'
        portfolio.positions[idx].orders.push(order)
        console.log('339 : ',portfolio.positions[idx])
      }

      :Buy

      if (order.side = 'buy') {
        portfolio.positions[idx].qty += order.qty
        portfolio.balance -= reportPrice * order.qty
        order.state = 'filled'
        portfolio.positions[idx].orders.push(order)
        console.log('346 : ',portfolio.positions[idx])
      }

      if ((order.side == 'buy') && (tradeCost > balance)) {
        portfolio.positions.orders.push(order)
        order.state = "not been filled, insufficient balance"
        console.log('332 : ',portfolio.positions[idx])
      }

      if (order.side = 'sell') {

      }



      self.attributes['portfolio'] = portfolio
      this.response.speak(`your order ${order.side} ${order.qty} <say-as interpret-as="spell-out">${order.symbol}</say-as> was ${order.state}`)
        .listen(`issue me a command`)
        .shouldEndSession(false)
      this.emit(':responseReady')
    })
    .catch(err => {
      console.log("err get quote : ",err)
    })

    
}
}, // End port intent