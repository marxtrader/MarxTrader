
const checkOrderReq = function(event) {
    if (event.request.intent.slots == undefined) {
      console.log('check res - no slots')
      return false
    } else if (( event.request.intent.slots.side.resolutions == undefined) || ( event.request.intent.slots.symbol.resolutions == undefined)) {
      console.log('check res - no resolutions')
      return false
    } else if ((event.request.intent.slots.side.resolutions.resolutionsPerAuthority[0].status.code == 'ER_SUCCESS_NO_MATCH') || (event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].status.code == 'ER_SUCCESS_NO_MATCH') ||(event.request.intent.slots.quantity.value <= 0)){
      console.log('check res - no matching slots')
      return false
    } else {
      console.log('check res - all required params present')
      return true
    }
  }
  module.exports = checkOrderReq;