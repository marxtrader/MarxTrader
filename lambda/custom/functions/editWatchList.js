

// create or edit a watchlist for the brief me intent.

const editWatchList = function(watchlist,event,cb) {
  event['watchlist'] = watchlist
  console.log('wrote to db : ',event.watchlist)
}
module.exports = editWatchList;