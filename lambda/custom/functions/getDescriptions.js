


const getDescriptions = function(symbol,callback) {
  let descriptions = require('../constants/descriptions');
  let speech = ""
  let cardSpeech = ""

  let key = Object.keys(descriptions) // get array of symbols

  let val = Object.keys(descriptions).map(function(key) {
    return descriptions[key];
  });

  let index = key.indexOf(symbol)
  
    if (index != -1) {
      speech = val[index];
    } else {
      speech = `There was no description that matched your request, please issue another command`
    }

  callback(null,speech);
}
module.exports = getDescriptions; 