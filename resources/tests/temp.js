// function slotValue(slot, useId){
//   let value = slot.value;
//   let resolution = (slot.resolutions && slot.resolutions.resolutionsPerAuthority && slot.resolutions.resolutionsPerAuthority.length > 0) ? slot.resolutions.resolutionsPerAuthority[0] : null;
//   if(resolution && resolution.status.code == 'ER_SUCCESS_MATCH'){
//       let resolutionValue = resolution.values[0].value;
//       value = resolutionValue.id && useId ? resolutionValue.id : resolutionValue.name;
//   }
//   return value;
// }

const replace = function(utterance, slot, value) {
  let utterances = [];
  let result = ""
  value.forEach(function(symbol) {
    utterance.forEach(function(sentence){
      utterances.push(sentence.replace(slot,symbol))
    })
  })
  //console.log(utterances)
  return utterances
}

let fs = require('fs');

let symbols = ['btcusd','ethusd']

const testObjects = []

let intentObj = { "name" : 'name', "utterances" : [] };

fs.readFile('en-US.json', "utf8", function(err, data) {
    if (err) {
        console.log('error : ',err)
    } else {
        data = JSON.parse(data)
        let invocationName = data.interactionModel.languageModel.invocationName
        let intents = data.interactionModel.languageModel.intents // array

        intents.forEach(function(intent) {           
            if (( intent.samples != undefined ) || ( intent.samples != [] )) {
                let samples = intent.samples;
                let slots = intent.slots  
                //console.log("Intent Slots : ",typeof(intent.slots))
                if  (slots != undefined)  {
                      intentObj.utterances = replace(samples,'{symbol}',symbols)
                      intentObj.name = intent.name
                      // console.log('has slots')
                      // console.log(intentObj.name)
                      // console.log(intentObj.utterances)
                      testObjects.push(intentObj)
                      intentObj = { "name" : 'name', "utterances" : [] };
                } else {
                  intentObj.name = intent.name
                  intentObj.utterances=samples
                  // console.log('no slots')
                  // console.log(intentObj.name)
                  // console.log(intentObj.utterances)
                  testObjects.push(intentObj)
                  intentObj = { "name" : 'name', "utterances" : [] };
                }
                //console.log(intentObj)                          
            }            
        });
    }
    console.log('test objects',testObjects)
});
