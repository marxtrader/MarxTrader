var getQuote = require ('../../lambda/custom/functions/getQuote');
require('isomorphic-fetch');
var val = 'sanusd';

getQuote(val)
  .then(quote => {
    if (quote =='undefined') {
     console.log('object was undefined')
    } else if (quote.message == "Unknown Symbol") {
      console.log('unknown symbol')
    } else {
      // quote.bid = (parseFloat(quote.bid) * 100)
      // quote.ask = (parseFloat(quote.ask) * 100)
      quote.bid = (Math.round((parseFloat(quote.bid) * 100)) / 100)
      quote.ask = (Math.round((parseFloat(quote.ask) * 100)) / 100)
      console.log("typeof : ",typeof(quote.bid))
      console.log("values : ",quote.ask ,quote.bid)
    }
  })
  .catch((err) => {
    console.log('error : ',err)
  })
