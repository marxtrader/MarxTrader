var BriefMe = require('../functions/briefMe')

var quote = [ 
  {
    mid: '8609.2',
    bid: 8607.1,
    ask: 8611.3,
    last_price: '8607.2',
    low: 8271.1,
    high: 8771.99,
    volume: 44142.33,
    timestamp: '1521838544.0040684',
    symbol: 'BTCUSD' 
  },
  { mid: '524.335',
    bid: 524.33,
    ask: 524.34,
    last_price: '524.34',
    low: 504.58,
    high: 543.05,
    volume: 189553.84, 
    timestamp: '1521838539.238785',
    symbol: 'ETHUSD' 
  } 
]

BriefMe(quote,function(err,data){
  console.log(data)
})