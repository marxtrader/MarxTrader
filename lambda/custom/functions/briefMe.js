
// called by the Brief me intent and passed an array of instruments
// takes an array of quote objects and builds the speech
const getQuotes = require('./getQuote')

const briefMe = function(watchlist,callback) {
  let speech =''
  let item = watchlist.length
  
  let quotes = getQuotes(watchlist)
  for(item in watchlist) {
    speech += `<say-as interpret-as="spell-out">${quotes[item].symbol}</say-as> is $${quotes[item].bid} and offered at $${quotes[item].ask}.`
  }
  callback(null,speech)
}
module.exports = briefMe;