
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

    getQuote(order.symbol)

    .then(quote => {
        
        let reportPrice = parseFloat(quote.last_price).toFixed(2)
        let sellPrice = parseFloat(quote.bid).toFixed(2)
        let buyPrice = parseFloat(quote.ask).toFixed(2)
        
        order.timeStamp = quote.timestamp
        
        // immediately Reject orders that would result in a negative quantity or issuficient balance

        if (order.side == "sell") {
            if (idx == -1) {
                order.state = "not been filled, No shorting allowed"
                portfolio.orders.push(order)
                callback(null, order, portfolio)
            } else {
                if (order.qty > portfolio.balance.positions[idx].qty) {
                    order.state = "not been filled, Your order quantity exceeds your position"
                    portfolio.orders.push(order)
                    callback(null, order, portfolio)
                } 
            }
        }
      
        if ((order.side == 'buy') && ((buyPrice*order.qty) > portfolio.balance.cash)) {
            order.state = "not been filled, insufficient balance"
            portfolio.orders.push(order)
            callback(null, order, portfolio)
        }
        
        // Handle legitimate orders.

        if (order.side=='sell')  {

            let proceeds = (sellPrice * order.qty).toFixed(2)
            let cost = (order.qty * portfolio.balance.positions[idx].avgprice).toFixed(2)
            let pl = proceeds - cost
            order.price = sellPrice
            order.proceeds = proceeds
            order.state = 'filled'

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
                    console.log("flag set to true")
                } 
                //else {
                //     console.log("ugg..can't be false : ",portfolio.balance.positions)
                // }
            };
            callback(null, order, portfolio)
        }
        
        if (order.side == 'buy') {

            // get the ask price and calculate the cost of the trade.
            order.price = parseFloat(buyPrice).toFixed(2)
            order.cost = parseFloat((buyPrice*order.qty).toFixed(2))
            console.log("buy price, cost : ",buyPrice, order.cost)
            console.log("type of : ",typeof(buyPrice), typeof(order.cost))
            console.log("Type of costBasis : ",portfolio.balance.costBasis)

            if ((idx == -1) && (portfolio.empty == true)) {

                let newPosition = {
                    "symbol":order.symbol,
                    "qty":order.qty,
                    "avgprice":buyPrice,
                    "costBasis":order.cost
                }

                order.state = 'filled'
                portfolio.empty = false
                portfolio.balance.cash -= order.cost
                portfolio.balance.costBasis += order.cost
                //portfolio.balance.costBasis = parseFloat(portfolio.balance.costBasis).toFixed(2)
                console.log("type of costBasis : ",typeof(portfolio.balance.costBasis))
                portfolio.balance.positions.push(newPosition)
                portfolio.orders.push(order)
                callback(null, order, portfolio)

            } else if ((order.side == 'buy') && (idx != -1)) {
                order.state = 'filled'
                portfolio.balance.positions[idx].qty += order.qty
                portfolio.balance.costBasis += parseFloat(order.cost).toFixed(2)
                portfolio.balance.cash -= parseFloat(order.cost).toFixed(2)
                portfolio.balance.positions[idx].costBasis += order.cost
                portfolio.balance.positions[idx].avgprice = parseFloat((portfolio.balance.positions[idx].costBasis / portfolio.balance.positions[idx].qty).toFixed(2))
                portfolio.orders.push(order)
                callback(null, order, portfolio)

            } else if ((idx == -1) && (portfolio.empty == false)) {
                let newPosition = {
                    "symbol":order.symbol,
                    "qty":order.qty,
                    "avgprice":buyPrice,
                    "costBasis":order.cost
                }

                order.state = 'filled'
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

