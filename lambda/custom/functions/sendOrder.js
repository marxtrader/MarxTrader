
  const precision = function (number, precision=2) {
    var factor = Math.pow(10, precision);
    return (Math.round(number * factor) / factor).toFixed(precision).toString()
  }

  const tieOut = function() {
    if (costBasis == x ) {

    }
  }

const sendOrder = function (portfolio, order, idx, callback) {    

    const getQuote = require('./getQuote')

    order.reject = false

    getQuote(order.symbol)

    .then(quote => {
    
        let sellPrice = quote.bid
        let buyPrice  = quote.ask
        order.timeStamp = quote.timestamp
        
        // immediately Reject orders that would result in a negative quantity or issuficient balance

        if (order.side == "sell") {
            if (idx == -1) {
                order.state = "has not been filled, No shorting allowed"
                order.reject = true
                portfolio.orders.push(order)
                callback(null, order, portfolio)
            } else {
                if (order.qty > portfolio.balance.positions[idx].qty) {
                    order.state = "has not been filled, Your order quantity exceeds your position"
                    order.reject = true
                    portfolio.orders.push(order)
                    callback(null, order, portfolio)
                } 
            }
        }
      
        if ((order.side == 'buy') && ((buyPrice*order.qty) > portfolio.balance.cash)) {
            order.state = "has not been filled, insufficient balance"
            order.reject = true
            portfolio.orders.push(order)
            callback(null, order, portfolio)
        }
        
        // Handle legitimate orders.

        if (order.side=='sell')  {

            let proceeds = Math.round(sellPrice * order.qty)
            let cost = Math.round(order.qty * portfolio.balance.positions[idx].avgprice)
            let pl = proceeds - cost
            order.price = sellPrice
            order.proceeds = proceeds
            order.state = 'was filled'

            console.log("proceeds cost and Pl : ",proceeds, cost, pl)

            // take difference between costbasis and proceeds and book to p and l
            portfolio.balance.bookedpl += pl

            // adjust cash position and cost basis
            portfolio.balance.cash += proceeds
            portfolio.balance.positions[idx].costBasis -= cost

            //reduce position by order qty
            portfolio.balance.positions[idx].qty -= order.qty

            // adjust costbasis for account
            portfolio.balance.costBasis -= cost

            // push order onto blotter
            portfolio.orders.push(order)

            // remove empty position 
            if (portfolio.balance.positions[idx].qty == 0) {             
                portfolio.balance.positions.splice(idx,1)

                // reset the empty portfolio flag to true
                if (portfolio.balance.positions.length == 0) {
                    portfolio.empty = true
                } 
                //else {
                //     console.log("ugg..can't be false : ",portfolio.balance.positions)
                // }
            };
            callback(null, order, portfolio)
        }
        
        if (order.side == 'buy') {

            // get the ask price and calculate the cost of the trade.
            order.price = (buyPrice)
            order.cost = (buyPrice*order.qty)

            if ((idx == -1) && (portfolio.empty == true)) {

                let newPosition = {
                    "symbol":order.symbol,
                    "qty":order.qty,
                    "avgprice":buyPrice,
                    "costBasis":order.cost
                }

                order.state = 'was filled'
                portfolio.empty = false
                portfolio.balance.cash -= order.cost
                portfolio.balance.costBasis += order.cost
                portfolio.balance.positions.push(newPosition)
                portfolio.orders.push(order)
                callback(null, order, portfolio)

            } else if ((order.side == 'buy') && (idx != -1)) {
                order.state = 'was filled'
                portfolio.balance.positions[idx].qty += order.qty
                portfolio.balance.costBasis += (order.cost)
                portfolio.balance.cash -= (order.cost)
                portfolio.balance.positions[idx].costBasis += order.cost
                portfolio.balance.positions[idx].avgprice = ((portfolio.balance.positions[idx].costBasis / portfolio.balance.positions[idx].qty))
                portfolio.orders.push(order)
                callback(null, order, portfolio)

            } else if ((idx == -1) && (portfolio.empty == false)) {
                let newPosition = {
                    "symbol":order.symbol,
                    "qty":order.qty,
                    "avgprice":buyPrice,
                    "costBasis":order.cost
                }

                order.state = 'was filled'
                portfolio.empty = false
                portfolio.balance.cash -= newPosition.costBasis
                portfolio.balance.costBasis += (newPosition.costBasis)
                portfolio.balance.positions.push(newPosition)
                portfolio.orders.push(order)
                callback(null, order, portfolio)
            }
        }
    })
    .catch(err => {
        order.state = 'Some error prevented this order from being filled'
        console.log(err)
        callback('Some error prevented this order from being filled', order, portfolio)
    });
};
module.exports = sendOrder;

