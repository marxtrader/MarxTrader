


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
      cardSpeech = speech.replace('<say-as interpret-as="spell-out">',' ')
      cardSpeech = cardSpeech.replace('</say-as>',' ')
    } else {
      speech = `There was no description that matched your request, please issue another command`
      cardSpeech = speech
    }
  callback(null,speech,cardSpeech);
}
module.exports = getDescriptions; 