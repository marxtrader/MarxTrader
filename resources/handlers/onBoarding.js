var Alexa = require('alexa-sdk');

// Constants
var constants = require('../constants/constants');

// Onboarding Handlers
var onBoarding = Alexa.CreateStateHandler(constants.states.ONBOARDING, {

    'NewSession' : function() {

        // Check for User Data in Session Attributes
        var userName = this.attributes['userName'];
        if (userName) {
          // Change State to Main:
          this.handler.state = constants.states.MAIN;
          this.emitWithState('LaunchRequest');
        } else {

          // Welcome User for the First Time
          this.emit(':ask', `Welcome to the crypto advisors skill. Given this is your first time here, we would like your name, so we can deliver a watchlist, so you can get a list of instruments without asking for each one. We would also use it, to support a profit and loss report of your holdings. Please provide your name by saying, my name is, and then your name.`, `Please say, my name is, then your name`);
        }
    },

    'NameCapture' : function() {
      // Get slot values
      var USFirstNameSlot = this.event.request.intent.slots.USFirstName.value;

      var name;
      if (USFirstNameSlot) {
        name = USFirstNameSlot;
      } 

      //save in session Attributes
      if (name) {
        this.attributes['userName'] = name;
        this.emitwithstate('LaunchIntent');
      } else {
        this.emit(':ask', `Sorry, I didn't recognise that name!, say my name is, and then your name`, `Tell me your name by saying: My name is, and then your name.`);
      }
    },

    'AMAZON.HelpIntent' : function() {
      this.emit(':tell', `you have entered the help intent onboarding`)
    },

    'AMAZON.CancelIntent' : function() {
      this.emit(':tell', `you have entered the cancel intent onboarding`);
    },

    'AMAZON.StopIntent' : function() {
      this.emit(':tell', `you have entered the stop intent onboarding`);
    },

});