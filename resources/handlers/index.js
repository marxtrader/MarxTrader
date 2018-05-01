var Alexa = require('alexa-sdk');

// Constants
var constants = require('./constants/constants');

// Handlers
var onboardingStateHandlers = require('./handlers/onboardingStateHandlers');
var mainStateHandlers = require('./handlers/mainStateHandlers');
var manageAttributesHandlers = require('./handlers/manageAttributesHandlers');

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);

  alexa.appId = constants.appId;
  alexa.dynamoDBTableName = constants.dynamoDBTableName;

  alexa.registerHandlers(
    onBoardingStateHandlers,
    manageAttributesHandlers,
    mainStateHandlers
  );

  alexa.execute();
};
