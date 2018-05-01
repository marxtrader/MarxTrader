
const cl=function(text) {
  console.log(text)
}

const event = require('../requests/no_slots')
//const event = require('../requests/er_success_no_match')
//const event = require('../requests/ValidRequest')

const checkRes = require('../../lambda/custom/functions/checkRes')

cl(checkRes(event))
