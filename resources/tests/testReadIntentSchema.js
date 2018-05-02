
let fs = require('fs');

let symbols = ['btcusd','ethusd']

const testObjects = []

let intentObj = { "name" : 'name', "utterance" : [] };

fs.readFile('en-US.json', "utf8", function(err, data) {
    if (err) {
        console.log('error : ',err)
    } else {
        data = JSON.parse(data)
        let invocationName = data.interactionModel.languageModel.invocationName
        let intents = data.interactionModel.languageModel.intents // array

        // loop through intents array
        intents.forEach(function(intent) {
          
          // get intent name
            intentObj.name = intent.name
            console.log('intent', intent.name)
            
            //replace slot in utterances with a value
            if (( intent.samples != undefined ) || ( intent.samples != [] )) {
                let samples = intent.samples;  
                console.log("Intent Slots : ",typeof(intent.slots))
                if  (typeof(intent.slots) != undefined)  {
                    for (var i =0;i<symbols.length;i++) {
                      samples.forEach(function(text) {
                        let utterance = text.replace(/{symbol}/,symbols[i])
                        intentObj.utterance.push(utterance)
                      });
                    }
                } else {
                  intentObj.utterance=samples
                  console.log("no slots")
                }                          
            }
            testObjects.push(intentObj)
            intentObj = { "name" : 'name', "utterance" : [] };
        });
            console.log('test objects',testObjects)
    }
});
