var getRandomDescription = require('../../lambda/custom/functions/getRandomDescription')
var symbol;

getRandomDescription(function(err,data){
  if (err) {
    console.log('error')
  } else {
    console.log(data)
  }
})