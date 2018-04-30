
const checkRes = function(event) {
  if (event.request.intent.slots == undefined) {
    console.log('check res no slots')
    return false
  } else if ( event.request.intent.slots.symbol.resolutions == undefined)  {
    console.log('check res no resolutions')
    return false
  } else if (event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].status.code == 'ER_SUCCESS_NO_MATCH'){
    console.log('check res no match')
    return false
  } else {
    console.log('check res - got a match')
    return true
  }
}
module.exports = checkRes;