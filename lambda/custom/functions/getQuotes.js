
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
    return (Math.round(number * factor) / factor).toFixed(precision).toString()
  };

  require ('isomorphic-fetch');

  const getQuote = function(symbolName) {
    const url = `https://api.bitfinex.com/v1/pubticker/${symbolName}`
    console.log("sym : ",symbolName)
    return fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(json => {
        json['symbol'] = symbolName
        json.bid = percisionToString(json.bid,2)
        json.last_price = percisionToString(json.last_price,2)
        json.ask = percisionToString(json.ask,2)
        json.volume = percisionToString(json.volume,0)
        json.high = percisionToString(json.high,2)
        json.low = percisionToString(json.low,2)
        return json
      })
  }
  
  const getQuotes = function(symbolNames) {
    const promises = symbolNames.map(getQuote)
    return Promise.all(promises)
  }

module.exports = getQuotes;
