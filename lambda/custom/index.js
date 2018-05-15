'use strict'; 

const Alexa= require("alexa-sdk");
const AWS = require('aws-sdk')
//require('isomorphic-fetch')


// helper functions
const getQuotes = require('./functions/getQuotes'); // returns the current quote object
const getQuote = require('./functions/getQuote')
const checkQuoteReq = require('./functions/checkQuoteReq')
const checkOrderReq = require('./functions/checkOrderReq')
const checkWlReq = require('./functions/checkWlReq')
const constants = require('./constants/constants');
const sendOrder = require('./functions/sendOrder')

AWS.config.update({region: "us-east-1"});

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);

  alexa.appId = constants.appId;
  alexa.dynamoDBTableName = constants.dynamoDBTableName;

  // Register State handlers
  alexa.registerHandlers(handlers);

  alexa.execute();
};

const handlers = {

  'Unhandled' : function() {
    console.log('Unhandled intent: ',JSON.stringify(this.event))
    this.emit(':saveState', true);

    let speech = `We apologize. We could not associate your command with an available intent. It has been reported to the quality assurance team. Ask for help or ask for the price of a crypto`

    this.emit(':ask', speech, `give me a command`);

  },

  'NewSession' : function() {
    console.log('New Session intent: ',JSON.stringify(this.event))
    let self = this;
    // Check for User Data in Session Attributes
    let speech = ''
    let userName = this.attributes['userName'];
    //putToDynamo(this.event)
    let watchlist = this.attributes['watchlist']
    let portfolio = this.attributes['portfolio']

    if (userName) {
      // Welcome User Back by Name
      this.emit(':ask', `lets go ${userName} ,issue me a command`, `issue me a command`);
    } else {
      // Welcome User for the First Time
      this.emit(':ask',` welcome to the marx trader alexa skill. This portal provides real time quotes on a host of crypto coins, smart contracts and other blockchain implimentations. Before we provide you with a short too torial on the skills yousage, we would like your name, in order to provide a superior customer experience. Please provide your name by saying, my name is, and then your name.`,`Please provide your name by saying, my name is, and then your name.`);
    }
  },

  'NameCapture' : function() {
    console.log('Name Capture intent: ',JSON.stringify(this.event))
    // Get slot values
    var USFirstNameSlot = this.event.request.intent.slots.USFirstName.value;
    let self = this;
    let speech = ''

    var name;
    if (USFirstNameSlot) {
      name = USFirstNameSlot;
    } 

    //save in session Attributes
    if (name) {
      
      this.attributes['portfolio'] = constants.initPortfolio 
      this.attributes['watchlist'] = ['btcusd', 'ethusd','ltcusd'];
      this.attributes['userName'] = name;
      //this.emit('LaunchRequest')
      this.emit('AMAZON.HelpIntent');

    } else {
      speech = (`Sorry, I didn't recognise that name!, say my name is, and then your name`);
    }
    self.response.speak(`${speech}`)
        .listen( `Tell me your name by saying: My name is, and then your name.`)
        .shouldEndSession(false);
    self.emit(':responseReady')
  },

  'LaunchRequest' : function() {
    console.log('Launch Request intent: ',JSON.stringify(this.event))
    this.emit(':ask', `issue me another command`,`issue me another command`);
  },

  'QuoteIntent' : function() {

    console.log('Quote intent: ',JSON.stringify(this.event))
    let self = this;
    let speech =''

      // returns true if resolutions exist
      if (checkQuoteReq(this.event)) {

          let symbol = (this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].values[0].value.id);

          let symbolName = this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].values[0].value.name;

          getQuote(symbol)
            .then(quote => {
              let last_price = (quote.last_price/100)
              speech = ( `<say-as interpret-as="spell-out">${quote.symbol}</say-as> is $${last_price}, issue me another command. `)
              //cardSpeech = (`${quote.symbol} is $${last_price}, issue me another command. `)
              self.response.speak(speech)
                  .listen(`issue me a command`)
                  .shouldEndSession(false);
              self.emit(':responseReady')
            })
            .catch(err => {
              console.log("error : ",err)
              self.emit(':ask',`sorry, we do not cover that instrument, try again or ask for help`,`try again or ask for help`)
            });
      } else {
        this.emit(':ask',`sorry, we were not able to determine the instrument, try again or ask for help`,`try again or ask for help`)
      }
  },

  'DetailedQuoteIntent' : function() {
      console.log('Detailed Quote intent: ',JSON.stringify(this.event))  
      let self=this;
      // returns true if resolutions exist
      if (checkQuoteReq(this.event) ) {


          let symbol=(this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].values[0].value.id);
          let symbolName = this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].values[0].value.name;   

          getQuote(symbol)
            .then(quote => {

              let bid = (quote.bid/100)
              let ask = (quote.ask/100)
              let low = (quote.low/100)
              let high = (quote.high/100)

              self.response.speak(`<say-as interpret-as="spell-out">${quote.symbol}</say-as> is $${bid} and offered at $${ask}. the high is $${high}, the low, is $${low}. on Volume of ${quote.volume}. give me another command `)
                  .listen(`give me another command `)
                  //.cardRenderer(`${quote.symbol} is $${bid} and offered at $${ask}. the high is $${high}, the low, is $${low}. on Volume of ${quote.volume}. give me another command `)
                  .shouldEndSession(false);
              self.emit(':responseReady')
            })
            .catch(err => {
              self.response.speak(`sorry, we do not cover that instrument, try issuing another command, or ask for help.`)
                  .listen(`issue a command, or ask for help.`)
                  //.cardRenderer(`Something went wrong and we could not fulfill your request, try issuing another command.`)
                  .shouldEndSession(false);
              self.emit(':responseReady')
            })
      } else {
        self.response.speak(`sorry, we were not able to determine the instrument, try issuing another command, or ask for help.`)
            .listen(`issue a command, or ask for help.`)
            //.cardRenderer((`Something went wrong and we could not fulfill your request, try issuing another command.`))
            .shouldEndSession(false);
        self.emit(':responseReady')
      }
  },

  'DescribeIntent' : function() {
    console.log('Describe intent: ',JSON.stringify(this.event))

    let self=this;

    // returns true if resolutions exist
    if (checkQuoteReq(this.event) ) {      

        let getDescriptions = require('./functions/getDescriptions')

        let symbol=this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].values[0].value.id

        let symbolName = this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        getDescriptions(symbol, function(err,speech) {      
          if (err) {
            self.emit(':ask', `sorry, we were unable to find that instrument, try again or ask for help.`,`try again or ask for help`);
          } else {
            self.emit(':ask', speech + `. issue me another command`,`try again or ask for help`)
          }
        })
    } else {
      self.emit(':ask', `sorry, we were unable to find that instrument, try again or ask for help.`,`try again or ask for help`);
    }
  },
  
  'DescribeRandomIntent' : function() {
    console.log('Describe Random Intent: ',JSON.stringify(this.event))
    let self = this;
    let speech = ''
    var getRandomDescription = require('./functions/getRandomDescription')

    getRandomDescription(function(err,data){
      if (err) {
        self.emit('Unhandled')
      } else {
        if (data) {
          speech=(data)
        } else {
          speech=(`sorry, that coin does not exist in our database, issue me another command`)
        }
        self.response.speak(`${speech}`)
            .listen(`issue me another command`)
            //.cardRenderer(data, `issue me another command`)
            .shouldEndSession(false);
        self.emit(':responseReady')
      }
    })
  },

  'BriefMeIntent' : function(){
    let self = this;
    let speech = ''
    //let positions = this.attributes['portfolio.balance.positions'];
    let watchlist = this.attributes['watchlist']
    
    getQuotes(watchlist)
      .then(quotes => {
        let last_price = 0
        let speech=''
        for (var i=0;i<quotes.length;i++) {
          last_price = (quotes[i].last_price/100)
          speech = speech + `<say-as interpret-as="spell-out">${quotes[i].symbol}</say-as> is $${last_price}.`
        }  
        self.response.speak(`${speech}, issume me another command`) 
            .listen(`Issue me another command`)
            //.cardRenderer(`${speech}, issue me another command`)
            .shouldEndSession(false);
        self.emit(':responseReady'          
        )
    })
  },

  'EditWatchList' : function() { 
    console.log("Event  : ",JSON.stringify(this.event))
    let speech =``

    if (checkWlReq(this.event)) { // check for a valid request with all parameters needed present
    
        let self = this;
        let watchlist = this.attributes['watchlist']        

        const symbol = (this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].values[0].value.name);

        const action = this.event.request.intent.slots.action.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        var idx = watchlist.indexOf(symbol);

        if ((idx == -1 ) && (action == 'remove')) {
          speech = "That Symbol is not in the watchlist, try another command or ask for help"

        } else if ((idx != -1 ) && (action == 'add')) {
          speech = "that symbol is already in your watchlist, try another command or ask for help"

        } else if ((idx == -1 ) && (action == 'add')) {
            // add symbol to watch list
            speech = `you successfully added,<say-as interpret-as="spell-out">${symbol}</say-as> to your watchlist, issue me another command`
            watchlist.push(symbol)
            self.attributes['watchlist'] = watchlist

        } else if ((idx != -1 ) && (action == 'remove')) {
            // remove symbol from watch list
            speech = `you successfully removed,<say-as interpret-as="spell-out">${symbol}</say-as> from your watchlist, issue me another command`
            watchlist.splice(idx,1)
            self.attributes['watchlist'] = watchlist
        }
    } else {
      this.emit('Unhandled') // ill formated request
    }
    
    this.response.speak(`${speech}`)                                        
        .listen(`issue me another command`)
        //.cardRenderer( `${speech}`)
        .shouldEndSession(false);
    this.emit(':responseReady')
  }, // End Edit Watchlist

  'PortfolioIntent' : function() { 

    console.log("Event  : ",JSON.stringify(this.event))        

    if (checkOrderReq(this.event)) { // check for a valid request with all parameters needed present
    
        let self = this;

        let order = {}
        let idx;

        let portfolio = this.attributes['portfolio']        

        order.symbol = (this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].values[0].value.name);

        order.side = this.event.request.intent.slots.side.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        order.qty = parseInt(this.event.request.intent.slots.quantity.value,10);

          // see if the order exists and if so grab the index and port object
          // default to not found

          if (portfolio.empty) {
            idx = -1
          } else {
            for (let i =0; i < portfolio.balance.positions.length; i++) {
              if (order.symbol == portfolio.balance.positions[i].symbol) {              
                idx = i
                break;
              } else {
                idx = -1
              }
            }
          }

          sendOrder(portfolio, order, idx, function(err, order, portfolio) {

            if (err) {
                //portfolio.orders.push(order)
                self.response.speak(` ${err} , issue me another command `)
                  .listen(`issue me another command`)
                  .cardRenderer(` ${err} , issue me another command `)
                  .shouldEndSession(false)
                self.emit(':responseReady') 
            } else {
                  let price = order.price/100
                  self.attributes['portfolio'] = portfolio

                  if (order.reject) {
                    self.response.speak(`your order ${order.side} ${order.qty} <say-as interpret-as="spell-out">${order.symbol}</say-as> ${order.state}. issue me another command `)
                      .listen(`issue me another command`)
                      .shouldEndSession(false);
                    self.emit(':responseReady')
                  } else {
                    self.response.speak(`your order ${order.side} ${order.qty} <say-as interpret-as="spell-out">${order.symbol}</say-as> ${order.state} at a price of $${price}. issue me another command`)
                        .listen(`issue me another command`)
                        .shouldEndSession(false);
                    self.emit(':responseReady')
                  }                    
            }
          })
    } else {
      this.response.speak(`sorry, you did not provide enough information to provide a response., try again or ask for help`) 
          .listen(`try again or ask for help`)
          //.cardRenderer(`sorry, you did not provide enough information to provide a response., try again or ask for help`)
          .shouldEndSession(false);
      this.emit(':responseReady')
    }
  }, // End port intent

  'DescribeAccount' : function() {
    // check request
    // import port
    // compare current prices to average price

    let self = this;
    let portfolio = this.attributes['portfolio'];
    let posList = [];
    let speech =''
    let cardSpeech = ''
    let profitLoss = 0.0;
    let totalpl = 0.0;

    let cash = portfolio.balance.cash / 100
    let costBasis = portfolio.balance.costBasis / 100
    let bookedpl = portfolio.balance.bookedpl / 100

    if (portfolio.empty) {
      this.emit(':ask',  ` your balance is ${cash} dollars,  You have no positions in your portfolio, get in the game and buy something, issue me another command. `)
    } else{
      for (let i=0;i<portfolio.balance.positions.length;i++) {
        posList.push(portfolio.balance.positions[i].symbol)
      }
    }

    getQuotes(posList)
      .then(quotes => {

        speech = speech + ` your balance is $${cash} in cash, with a cost basis of $${costBasis} on your portfolio. your booked profit or loss is $${bookedpl}. `

        //cardSpeech = cardSpeech + ` your balance is $${cash} in cash with a cost basis of $${costBasis} on your portfolio. your booked profit or loss is $${bookedpl}. `

        for (var i=0;i<quotes.length;i++) {

          profitLoss = (((quotes[i].last_price) * portfolio.balance.positions[i].qty) - (portfolio.balance.positions[i].costBasis))

          // values are stored in pennies

          totalpl += (profitLoss/100)

          if (profitLoss > 0) {
              speech = speech + ` on your position of ${portfolio.balance.positions[i].qty}  <say-as interpret-as="spell-out">${quotes[i].symbol}</say-as>, you have a profit of $${profitLoss/100},`

              //cardSpeech = cardSpeech + ` on your position of ${portfolio.balance.positions[i].qty}  ${quotes[i].symbol} you have a profit of $${profitLoss/100},`

          } else {
              speech = speech + ` on your position of ${portfolio.balance.positions[i].qty} <say-as interpret-as="spell-out">${quotes[i].symbol}</say-as>, you have a loss of $${profitLoss/100},`

              //cardSpeech = cardSpeech + ` on your position of ${portfolio.balance.positions[i].qty} ${quotes[i].symbol} you have a loss of $${profitLoss/100},`
          }
        }  

        if (totalpl > 0) {
          speech += `for a total profit of $${totalpl} `
        } else if (totalpl < 0) {
          speech += `for a total loss of $${totalpl} `
        } else {
          speech += ` with no realized profit or loss`
        }
        
        self.response.speak(` ${speech}. issue me another command `)
          .listen(`issue me another command`)
          //.cardRenderer(` ${cardSpeech} , issue me another command `)
          .shouldEndSession(false);
        self.emit(':responseReady')
    })
  },

  'RecentNews' : function() {
    this.emit(':ask',`We have recently added paper trading. Keep track of your trading prowess. we keep track of your realized profits or losses. Realized means selling a position. Your profit is based on what you paid, as an average price over all your purchases.  we will soon add a top 3 traders list. `)
  },

  'AMAZON.HelpIntent' : function() {
    let responseSpeech = ` We keep track of a number of crypto instruments. ask for a quote on one of todays most popular crypto coins. you can also ask for a random description of the instruments we cover. this is a great way to gain an understanding of how the coin is monetized, what need it tries to satisfy, and how those services are delivered. We start you out with a short watch list, containing bit coin, lite coin and ethereum. Say, brief me, to get current prices on cryptos you have an interest in. You can also add or remove items by saying, as an example, add ripple to my watchlist. you can ask for a detailed quote by saying, give me details, and then the crypto you want. and finally, There is an order engine for paper trading. we start you with a 500000 dollar balance. just say, buy 5 bit coin. You can't go short, meaning you can't sell more coins than you own. To get a summary of your account, say, How am I doing, or give me an account summary. Lets get started. what can I do for you?`

    this.response.speak(`${responseSpeech}`)
        .listen(`if you need to hear it again, just say I need help `)
        //.cardRenderer(`Help`,`${responseSpeech}`)
        .shouldEndSession(false)
    this.emit(':responseReady')
  },

  'AMAZON.CancelIntent' : function() {
    this.emit(':tell', "Good bye");
  },

  'AMAZON.StopIntent' : function() {
    this.emit(':tell', "Good bye");
  },

  'SessionEndedRequest': function () {
    // Force State Save When User Times Out
    this.emit(':saveState', true);
    this.emit(':tell', "Good bye");
  },
};