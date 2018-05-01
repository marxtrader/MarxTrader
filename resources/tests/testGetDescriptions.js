var getDescriptions = require('../../lambda/custom/functions/getDescriptions')
var symbol;

getDescriptions('',function(err,data){
  if (err) {
    console.log('error')
  } else {
    console.log(data)
  }
})