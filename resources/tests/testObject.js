var quote = {
  "bid" : 123.456,
  "ask" : 234.567, 
  "volume" : 9876.5432
};

const roundIt = require('../functions/roundIt')

key = (Object.keys(quote))
Object.getOwnPropertyNames(quote).forEach(
  function (val, idx, array) {
    //console.log(roundIt(quote[val]))
    roundIt(quote[val], 2, function(err,data){
      if (!err) {
        console.log(data)
      }
    })
  },
);
