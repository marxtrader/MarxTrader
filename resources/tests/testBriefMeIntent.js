


var getQuotes = require('../functions/getQuote')
var symbols = ['BTCUSD','ETHUSD','LTCUSD'];

getQuotes(symbols)
  .then(quotes => {
    let speech=''
    for (var i=0;i<quotes.length;i++) {
      speech = speech + `<say-as interpret-as="spell-out">${quotes[i].symbol}</say-as> is $${quotes[i].bid} and offered at $${quotes[i].ask}.`
    }  
    console.log (speech)
})