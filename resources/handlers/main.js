var Alexa = require('alexa-sdk');

// Constants
var constants = require('../constants/constants');

// Main State Handlers
var main = Alexa.CreateStateHandler(constants.states.MAIN, {

    'LaunchRequest' : function() {
      var userName = this.attributes['userName'];
      this.emit(':ask', `Hi <say-as interpret-as="interjection">${userName}</say-as>, welcome to the main menu. The options are, get prices, edit watch list, brief me, and help. speak your choice. `, `what you would like`);
    },

    'EditWatchlist' : function() {
        watchList = this.attributes['watchlist']

        if (watchList) {
         for (var i=0;i<watchList.length;i++) {
           // get quotes and build the response message
         }
        } else {
          this.emit(':ask', `you will need so say, Add then the instrument. `,`you need to say, add then the instrument to add`)
        }
    },

    'RemoveInstrumentFromWatchList' : function() {

    },

    'AddInstrumentToWatchlist' : function () {
      this.attributes[watchlist]
    },

    'GetAvailableInstruments' : function() {

    },

    'GetQuote' : function() {

    },

    'AMAZON.YesIntent' : function() {
      this.emit(':ask', "got yes intent")

      // console.log(this.attributes['passedintent'])

      // if (this.attributes['passedintent'] == 'ExperiencedUser') {
      //   this.attributes['experiencedUser'] = true;
      // }

      // if (this.attributes['passedintent'] == 'CreateWatchlist') {
      //   this.attributes['watchlist'] = true; 
      //   this.emit('CreateWatchlist')
      // }
    },

    'AMAZON.NoIntent' : function() {
      this.emit(':tell', `Got the passed intent`);
    },

    'AMAZON.HelpIntent' : function() {
      this.emit(':tell', `you have entered the help intent`)
    },

    'AMAZON.CancelIntent' : function() {
      this.emit(':tell', `you have entered the cancel intent`);
    },

    'AMAZON.StopIntent' : function() {
      this.emit(':tell', `you have entered the stop intent`);
    },
  
  });