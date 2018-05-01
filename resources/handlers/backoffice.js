var Alexa = require('alexa-sdk');

// Constants
var constants = require('../constants/constants');

// Main State Handlers
var bo = Alexa.CreateStateHandler(constants.states.BO, {

  'DetailReportPortfolioValueIntent' : function() {
    let positions = this.attributes['portfolio'];

    positions.forEach(position,function(err,data) {
      speech += ` ${position.long|position.short}, ${position.amount} of ${position.symbol} value is $${position.value} `
    })
      this.emit(':ask', ` Your positions are, ${speech}, another command? `, `another command?`)
  },

  'ReportPortfolioValueIntent' : function() {
    let positions = this.attributes['portfolio'];

    if (amount > 0) { // long
      
    } else { // short

    };

    getQuotes(watchlist)
      .then(quotes => {
        let speech=''
        for (var i=0;i<quotes.length;i++) {
            speech = speech + `<p><say-as interpret-as="spell-out">${quotes[i].symbol}</say-as> is $${quotes[i].bid} and offered at $${quotes[i].ask}.</p>`
        } 
        self.emit(':ask',` ${speech}. issue me a command `, `Issue me a command`)
      })

  },

  'ReportPositionsIntent' : function() {

  },

  'AMAZON.YesIntent' : function() {
    this.emit(':tell', `${exitSpeech}`);
    //this.emit(':saveState', true);
  },

  'AMAZON.HelpIntent' : function() {
    this.emit(':ask', `Welcome to the Crypto advisor skill. Anytime you need detailed instructions for this skill just say, Help or I need help. We keep track of a number of crypto instruments. You can ask for a list of coins, or ask if a specific crypto is quoted. You can create a watchlist by saying, create watchlist. This watch list can then be used in the brief me intent, to rip through the quotes of your watch list. And Finally, you can ask for a detailed quote by saying, give me details on the crypto you want. Lets get started. what can I do for you?`, `if you need to hear it again, just say I need help `)
  },

  'AMAZON.NoIntent' : function() {
    this.emit(':tell', `${exitSpeech}`);;
  },

  'AMAZON.CancelIntent' : function() {
    this.emit(':tell', `${exitSpeech}`);
  },

  'AMAZON.StopIntent' : function() {
    this.emit(':tell', `${exitSpeech}`);
  },

  'Unhandled' : function() {
    console.log("Speech : ",this.event.request)
    this.emit(':saveState', true);
    this.emit(':tell', `We apologize. Something went wrong. It has been reported to the quality assurance team. `);
  },
 
  'SessionEndedRequest': function () {
    // Force State Save When User Times Out
    this.emit(':saveState', true);
    this.emit(':tell', `${exitSpeech}`);
  },
});