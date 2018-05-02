
  // {
  //   "mid":"244.755",
  //   "bid":"244.75",
  //   "ask":"244.76",
  //   "last_price":"244.82",
  //   "low":"244.2",
  //   "high":"248.19",
  //   "volume":"7842.11542563",
  //   "timestamp":"1444253422.348340958"
  // }
  
  
  const percisionToString = function (number, precision=2) {
    var factor = Math.pow(10, precision);
    return (Math.round(number * factor) / factor).toFixed(precision)//.toString()
  }

  require('isomorphic-fetch');

  const getQuote = function(symbolName) {
    const url = `https://api.bitfinex.com/v1/pubticker/${symbolName}`
  
    return fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(json => {
        json['symbol'] = symbolName
        json.bid = Math.round(parseFloat(json.bid*100))
        json.last_price = Math.round(parseFloat(json.last_price*100))
        json.ask = Math.round(parseFloat(json.ask*100))
        json.volume = percisionToString(json.volume)
        json.high = Math.round(parseFloat(json.high*100))
        json.low = Math.round(parseFloat(json.low*100))
        return json
      })
    }
module.exports = getQuote;
