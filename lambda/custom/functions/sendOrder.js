
  const precision = function (number, precision=2) {
    var factor = Math.pow(10, precision);
    return (Math.round(number * factor) / factor).toFixed(precision).toString()
  }

  const tieOut = function() {
    if (costBasis == x ) {

    }
  }

  

const sendOrder = function (portfolio, order, idx, callback) {

    const cl = function(label){
        console.log(label, portfolio)
        console.log("Balance : ", portfolio.balance)
        console.log("cash : ", portfolio.balance.cash)
        console.log("bookedpl : ", portfolio.balance.bookedpl)
        console.log("cost basis : ", portfolio.balance.costBasis)
        console.log("positions : ", portfolio.balance.positions)
    }

    const getQuote = require('./getQuote')
    let reportPrice = 0.0

    console.log("order - ", order)

    getQuote(order.symbol)

    .then(quote => {
        
        reportPrice = precision(parseInt(quote.last_price,10),2)

        let tradeCost = (order.qty * reportPrice)        
        order.price = reportPrice
        order.timeStamp = quote.timestamp

        if (order.side == "sell") {
            if (idx == -1) {
                order.state = "not been filled, No shorting allowed"
                portfolio.orders.push(order)
                callback(null, order, portfolio)
            } else {
                if (order.qty > portfolio.balance.positions[idx].qty) {
                    order.state = "not been filled, No shorting allowed"
                    portfolio.orders.push(order)
                    callback(null, order, portfolio)
                } 
            }
        }
      
        if ((order.side == 'buy') && (tradeCost > portfolio.balance.cash)) {
            order.state = "not been filled, insufficient balance"
            portfolio.orders.push(order)
            callback(null, order, portfolio)
        }
        
        if (order.side=='sell')  {

            let proceeds = (reportPrice * order.qty)

            order.state = 'filled'
                        
            // adjust costbasis 
            portfolio.balance.costBasis -= portfolio.balance.positions[idx].costBasis

            // take difference between costbasis and proceeds and book to p and l
            portfolio.balance.bookedpl += proceeds - portfolio.balance.positions[idx].costBasis

            // adjust cash position and cost basis
            portfolio.balance.cash += proceeds
            portfolio.balance.positions[idx].costBasis -= (portfolio.balance.positions[idx].qty * portfolio.balance.positions[idx].avgprice)

            //reduce position by order qty
            portfolio.balance.positions[idx].qty -= order.qty

            // push order onto blotter
            portfolio.orders.push(order)

            // remove empty position 
            if (portfolio.balance.positions[idx].qty == 0) {     
                console.log("portfolio positions :  ",portfolio.balance.positions,"  : Idx = ",idx )          
                //let rem = splice(idx,1,portfolio.balance.positions)
                portfolio.balance.positions.splice(idx,1)
                if (portfolio.balance.positions == []) {
                    portfolio.empty = true
                }
            };
            callback(null, order, portfolio)
        }
        
        if (order.side == 'buy') {
            if ((idx == -1) && (portfolio.empty == true)) {
                let newPosition = {}
                order.state = 'filled'
                portfolio.empty = false
                newPosition.symbol = order.symbol
                newPosition.qty = order.qty 
                newPosition.avgprice = reportPrice
                newPosition.costBasis = (reportPrice * order.qty)
                portfolio.balance.cash -= newPosition.costBasis
                portfolio.balance.costBasis += (reportPrice * order.qty)
                portfolio.balance.positions[0] = newPosition
                portfolio.orders.push(order)
                callback(null, order, portfolio)

            } else if ((order.side == 'buy') && (idx != -1)) {
                order.state = 'filled'
                portfolio.balance.positions[idx].qty += order.qty
                portfolio.balance.costBasis += (reportPrice * order.qty)
                portfolio.balance.cash -= (reportPrice * order.qty)
                portfolio.balance.positions[idx].costBasis += (reportPrice * order.qty)
                portfolio.balance.positions[idx].avgprice = portfolio.balance.positions[idx].costBasis / portfolio.balance.positions[idx].qty             
                portfolio.orders.push(order)
                callback(null, order, portfolio)

            } else if ((idx == -1) && (portfolio.empty == false)) {
                let newPosition = {}
                order.state = 'filled'
                portfolio.empty = false
                newPosition.symbol = order.symbol
                newPosition.qty = order.qty 
                newPosition.avgprice = reportPrice
                newPosition.costBasis = (reportPrice * order.qty)
                portfolio.balance.cash -= newPosition.costBasis
                portfolio.balance.costBasis += newPosition.costBasis
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

