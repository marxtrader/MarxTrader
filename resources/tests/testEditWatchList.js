

const editlist = require('../functions/editWatchList')
//var watchlist = ["BTCUSD", "ETHUSD", "LTCUSD"];
var watchlist = ["BTCUSD", "ETHUSD", "LTCUSD","OMGUSD"];

symbol = "omgusd"

editlist(watchlist,symbol,"remove",function (err,data) {
  if (err) {
    console.log("Error : ", err)
  } else {
    console.log("Success : ", data)
  }
})
