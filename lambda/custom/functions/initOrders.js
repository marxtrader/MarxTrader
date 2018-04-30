const initOrders = function(watchlist) {
    const getQuotes = require("./getQuotes");
    const order = {};
    const orders =[];

    getQuotes(watchlist)
            .then(quotes => {
                for (var i=0;i<quotes.length;i++) {
                    order.price = quotes[i].price
                    order.symbol = quotes[i].symbol
                    order.qty = 10 
                    orders.push(order)
                    return orders
                }               
            })
            .catch(err => {
                console.log('error : ',err)
            })
}
module.exports = initOrders;