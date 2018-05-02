'use strict'; 

var Alexa= require("alexa-sdk");
var AWS = require('aws-sdk')
AWS.config.update({
  region: "us-east-1" // or whatever region your lambda and dynamo is
  });
var getQuotes = require('./functions/getQuote'); // returns the current quote object
//var editWatchList = require('./functions/editWatchList');

// Constants
var constants = require('./constants/constants');

// Main Handlers
var mainStateHandlers = Alexa.CreateStateHandler(constants.states.MAIN, {

  'Unhandled' : function() {
    console.log('unhandled intent: ',JSON.stringify(this.event))
    this.emit(':saveState', true);

    let speech = `We apologize. We could not associate your command with an available intent. It has been reported to the quality assurance team. Ask for help or ask for the price of a crypto`

    this.emit(':askWithCard', speech, `give me a command`,"Alert", speech);

  },

  'LaunchRequest' : function() {
    console.log('Launch Request intent: ',JSON.stringify(this.event))
    this.emit(':askWithCard',`Hi ${name}, issue me a command`,`Issue me a command`);
  },

  'QuoteIntent' : function() {
    console.log('Quote intent: ',JSON.stringify(this.event))
    let self=this;
    let symbols=[];
    let symbolName=''

    if (this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH") {
      symbols.push(this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].values[0].value.id);
      symbolName = this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    } else {
      this.emit('unhandled')
    }

    if ((symbols == '') || (symbols == null)) {
      this.emit('unhandled')
    }

    getQuotes(symbols)
      .then(quote => {
        self.emit(':askWithCard', `<say-as interpret-as="spell-out">${quote[0].symbol}</say-as> is $${quote[0].bid} and offered at $${quote[0].ask}, issue me a command `, `Issue me a command`,'Crypto Quote', `${quote[0].symbol} is $${quote[0].bid} and offered at $${quote[0].ask}, issue me a command ` )
      })
      .catch(err => {
        self.emit('unhandled')
      })
  },

  'DetailedQuoteIntent' : function() {
    console.log('Detailed Quote intent: ',JSON.stringify(this.event))    
    let self=this;
    let symbols=[];
    let symbolName=''

    if (this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH") {
      symbols.push(this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].values[0].value.id);
      symbolName = this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    } else {
      this.emit('unhandled')
    }

    if ((symbols == '') || (symbols == null)) {
      this.emit('unhandled')
    }

    getQuotes(symbols)
      .then(quote => {
        let quotes = quote[0]
        self.emit(':askWithCard', `<say-as interpret-as="spell-out">${quotes.symbol}</say-as> is $${quotes.bid} and offered at $${quotes.ask}. the high is $${quotes.high}, the low, is $${quotes.low}. on Volume of ${quotes.volume}. give me another command `, `another command`,"Quote",`${quotes.symbol} is $${quotes.bid} and offered at $${quotes.ask}. the high is $${quotes.high}, the low, is $${quotes.low}. on Volume of ${quotes.volume}. give me another command ` )
      })
      .catch(err => {
        self.emit(':askWithCard', `Something went wrong and we could not fulfill your request, try issuing another command.`,`issue a command, or ask for help.`,"Error",`Something went wrong and we could not fulfill your request, try issuing another command.`)
      })
  },

  'DescribeIntent' : function() {
    console.log('Describe intent: ',JSON.stringify(this.event))
    let getDescriptions = require('./functions/getDescriptions')
    let self=this;
    let symbol='';
    let symbolName=''

    if (this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_MATCH") {
      symbol=this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].values[0].value.id;
      symbolName = this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    } else {
      this.emit('unhandled')      
    };
    
    getDescriptions(symbol, function(err,data) {      
      if (err) {
        self.emit('unhandled');
      } else {
        self.emit(':askWithCard',data,`issue me a command`,"Instrument Description", data )
      }
    })
  },
  
  'DescribeRandomIntent' : function() {
    let self = this;
    console.log('Describe Random Intent: ',JSON.stringify(this.event))
    var getRandomDescription = require('./functions/getRandomDescription')
    getRandomDescription(function(err,data){
      if (err) {
        self.emit('unhandled')
      } else {
        self.emit(':askWithCard',`${data} issue me another command`, `issue me another command`,"Description",`${data}`)
      }
    })
  },

  'BriefMeIntent' : function(){
    let self = this;
    let watchlist = this.attributes['watchlist'];
    console.log(watchlist)
    getQuotes(watchlist)
      .then(quotes => {
        let speech=''
        for (var i=0;i<quotes.length;i++) {
          speech = speech + `<say-as interpret-as="spell-out">${quotes[i].symbol}</say-as> is $${quotes[i].last_price}.`
        }  
        self.emit(':ask',speech,`Issue me another command`) 
    })
  },

  // Edit the watchlist for the brief me skill
  'EditWatchList' : function() { 
    console.log("Event  : ",JSON.stringify(this.event))

    // check for existing resolutions authority
    
    let editWatchList = require('./functions/editWatchList')
    let self = this;

    let watchlist = this.attributes['watchlist']

    const symbol = (this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].values[0].value.name);

    const action = this.event.request.intent.slots.action.resolutions.resolutionsPerAuthority[0].values[0].value.name;

    if ((symbol == '') || symbol == null) {
      this.emit(':askWithCard', ` we didn't understand the symbol, please try again`, `please try again`,`watchlist edit`,`we didn't understand the symbol, please try again`)
    };

    if ((action == "") || (action == null)) {
      this.emit(':ask', ` we did't understand if you want to add or remove, please try again`,`please try again`,`watchlist edit`,` we did't understand if you want to add or remove, please try again`)
    };

    editWatchList(watchlist,symbol,action,function(err,data){
      if (err) {
        self.emit(':askWithCard',`${err}`,'issue me another command',`Watchlist edit`,`${err}`)
      } else {
        console.log('data returned :',data)
        self.attributes['watchlist'] = data
        switch (action) {
          case "add" :
            self.emit(':ask', ` <p><say-as interpret-as="spell-out">${symbol}</say-as> was successfully added to your watchlist , if you would like to make further edits, just say add or remove then the symbol`, `Issue me another command `)
            break;
          case "remove" :
            self.emit(':ask', ` <p><say-as interpret-as="spell-out">${symbol}</say-as> was successfully removed from your watchlist , if you would like to make further edits, just say add or remove then the symbol `, `Issue me another command.`)
            break;
        }
      }
    })
  }, // End Edit Watchlist

  'AMAZON.HelpIntent' : function() {
    let responseSpeech = ` We keep track of a number of crypto instruments. We created a short watch list for you. Containing bitcoin, light coin and ethereum. You can ed it the list by saying add or remove, and then the instrument. The watch list is used for the brief me command, a quick way, to get real time quotes on crypto's you have an interest in. And Finally, you can ask for a detailed quote by saying, give me details, and then the crypto you want. Lets get started. what can I do for you?`

    this.emit(':askWithCard',`${responseSpeech}` , `if you need to hear it again, just say I need help `,'Help', `${responseSpeech}`)
  },

  'AMAZON.CancelIntent' : function() {
    this.emit(':tellWithCard', "Good bye","Good Bye", "Have a nice day");
  },

  'AMAZON.StopIntent' : function() {
    this.emit(':tellWithCard', "Good bye","Good Bye", "Have a nice day");
  },
 
  'SessionEndedRequest': function () {
    // Force State Save When User Times Out
    this.emit(':saveState', true);
    this.emit(':tellWithCard', "Good bye","Good Bye", "Have a nice day");
  },
})