var order = {
    'type' : 'sell',
    'symbol' : 'btcusd',
    'qty' : 10
};

let p = require('../../lambda/custom/constants/constants')

let pos = p.balance
console.log(p.positions.length)

const sendOrder = function (order, cb) {

    const getQuote = require('../../lambda/custom/functions/getQuote')

    let report = [];
    let idx=-1;
    getQuote(order.symbol)
        .then(quote => {       
            report[0].price = parseInt(quote.last_price,10)
            report[0].symbol = quote.symbol
            report[0].qty = order.qty
            report[0].type= order.type
            report[0].filled = 'filled'
        
            switch (order.type) {

                case 'sell' :

                    // see if they own it if they do, make sure they have enough

                    for (var i = 0;i<portfolio.positions.length;i++) {
                        if ( order.symbol == portfolio.positions[i].symbol.name) {
                            idx = i
                            console.log("index : ",idx)
                            break;
                        }
                    }
                    
                    if ((idx >= 0) && (portfolio.positions[idx].symbol.qty >= order.qty)) {               
                        let remains = portfolio.positions[idx].symbol.qty - order.qty
                        if (remains){
                            portfolio.positions[idx].symbol.qty = remains
                            portfolio.balance += (order.qty*report[0].price)
                            //console.log('remainder after sale : ',typeof(order.qty),typeof(report[0].price))
                        } else {
                            portfolio.positions.splice(idx) 
                            //console.log('position flat')
                        }
                    } else {
                        report[0].filled = 'not been filled'
                    }
                break;

                case 'buy' :
                    if ((order.qty * report[0].price) < portfolio.balance) {
                        if (idx != -1) { // existing position, edit quant and balance
                            portfolio.balance -= order.qty * report.price
                            portfolio.positions[idx].symbol.qty += order.qty
                            portfolio.positions[idx].symbol.name = order.symbol
                        } else { // new position 
                            portfolio.positions.push(order)
                            portfolio.balance -= order.qty * report.price
                        }

                       
                    } else {
                        report[0].filled = 'not been filled'
                    }
                break;
            } // end switch
            report[1] = portfolio
            cb(null, report)
        })
        .catch(err => {
            report[0].filled = 'not been filled'
        })
};

sendOrder(order, function(err,report) {
    if ((err) && (!report.filled)) {
      console.log( "err : ",err)
    } else {
        console.log(JSON.stringify(report[1].portfolio))
        console.log(report[1])
    }
  })