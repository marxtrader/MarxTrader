
// return USD pairs
const request = require('request')
const url = `https://api.bitfinex.com/v1`
let usdPairs = []
const getSymbolList = function(callback) {
  request.get(url + '/symbols',
    function(error, response, body) {
      let list = JSON.parse(body)
      list.forEach(function(element) {
        if (element.slice(-3) == 'usd') {
          usdPairs.push(element);
        }
      })
      callback(null,usdPairs)
  });
}
module.exports = getSymbolList;