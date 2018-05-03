


// var desc = {"symbol":"description", "symbol1":"description1"}
// get a random description of covered instruments
// todo keep track of which descriptions the customer has recieved and exclude them.
const getRandomDescription = function(callback) {
  let descriptions = require('../constants/descriptions');
  let value = ``;
  let key = Object.keys(descriptions) // get array of symbols
  let val = Object.keys(descriptions).map(function(key) {
    return descriptions[key];
  });

  let index = Math.floor(Math.random() * key.length) + 1 // generate a random index between 1 and number of descriptios
  value = val[index]; // assign the random description to the return value.
  console.log(value)

  callback(null,value.toLowerCase());  // alexa prefers lowercase. 
module.exports = getRandomDescription;