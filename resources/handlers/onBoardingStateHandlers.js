'use strict'; 

var Alexa= require("alexa-sdk");
var AWS = require('aws-sdk')
AWS.config.update({
  region: "us-east-1" // or whatever region your lambda and dynamo is
  });

// Constants
var constants = require('./constants/constants');

// Onboarding Handlers
var onboardingStateHandlers = Alexa.CreateStateHandler(constants.states.ONBOARDING, {

  'Unhandled' : function() {
    console.log('unhandled intent: ',JSON.stringify(this.event))
    this.emit(':saveState', true);

    let speech = `We apologize. We could not associate your command with an available intent. It has been reported to the quality assurance team. Ask for help or ask for the price of a crypto`

    this.emit(':askWithCard', speech, `give me a command`,"Alert", speech);

  },

  'NewSession' : function() {
    console.log('New Session intent: ',JSON.stringify(this.event))
    // Check for User Data in Session Attributes
    var userName = this.attributes['userName'];

    if (userName) {
      this.handler.state = constants.states.MAIN;
      this.emitWithState('LaunchRequest');
      // Welcome User Back by Name
    } else {
      // Welcome User for the First Time
      this.emit(':askWithCard', `Welcome to your personal crypto assistant. This portal provides real time quotes on a host of crypto coins, smart contracts and other blockchain implimentations. Before we provide you with a short too torial on this skills yousage, we would like your name, in order to provide a superior customer experience. Please provide your name by saying, my name is, and then your name.`, `Please say, my name is, then your name`,`Welcome`, `Welcome to your personal crypto assistant. This portal provides real time quotes on a host of crypto coins, smart contracts and other blockchain implimentations. Before we provide you with a short too torial on this skills yousage, we would like your name, in order to provide a superior customer experience. Please provide your name by saying, my name is, and then your name.`);
    }
  },

  'NameCapture' : function() {
    console.log('Name Capture intent: ',JSON.stringify(this.event))
    // Get slot values
    var USFirstNameSlot = this.event.request.intent.slots.USFirstName.value;

    var name;
    if (USFirstNameSlot) {
      name = USFirstNameSlot;
    } 

    //save in session Attributes
    if (name) {
      this.attributes['userName'] = name;
      this.emit(':askWithCard', `Hi ${name}, Issue me a command `, `command me!`, "Hi", `Hi ${name}, Issue me a command `);
    } else {
      this.emit(':askWithCard', `Sorry, I didn't recognise that name!, say my name is, and then your name`, `Tell me your name by saying: My name is, and then your name.`,'Alert',`Sorry, I didn't recognise that name!, say my name is, and then your name`);
    }
  },

  'LaunchRequest' : function() {
    console.log('Launch Request intent: ',JSON.stringify(this.event))
    this.emit('NewSession');
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