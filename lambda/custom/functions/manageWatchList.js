

const manageWatchList = function(userId,callback) {
  // use the userId to get their saved watchlist

  wl = this.attributes['watchlist']

  if (wl=="") {
    // empty list, create one? 
    this.attributes['watchlist'] = ["btcusd","ltcusd", "ethusd"]
  } else {
    // edit the existing list
    
  }
}