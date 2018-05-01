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
    let watchlist = this.attributes['watchlist']
    let portfolio = this.attributes['portfolio']

    if (userName) {
      // Welcome User Back by Name
      speech = (`lets go ${userName} ,issue me a command`);
    } else {
      // Welcome User for the First Time
      speech = (`get ready, three, two, one, go.`)
      //speech = (` welcome to the marx trader alexa skill. This portal provides real time quotes on a host of crypto coins, smart contracts and other blockchain implimentations. Before we provide you with a short too torial on the skills yousage, we would like your name, in order to provide a superior customer experience. Please provide your name by saying, my name is, and then your name.`);
    }
    self.response.speak(`${speech}`)
        .listen( `issue me another command`)
        .cardRenderer(`${speech}`)
        .shouldEndSession(false)
    self.emit(':responseReady')
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
      this.emit('LaunchRequest')
      //this.emit('AMAZON.HelpIntent');

    } else {
      speech = (`Sorry, I didn't recognise that name!, say my name is, and then your name`);
    }
    self.response.speak(`${speech}`)
        .listen( `Tell me your name by saying: My name is, and then your name.`)
        .cardRenderer(`${speech}`)
        .shouldEndSession(false)
    self.emit(':responseReady')
  },

  'DescribeAccount' : function() {
    // check request
    // import port
    // compare current prices to average price
    let self = this;
    let portfolio = this.attributes['portfolio'];
    let posList = [];
    let speech =''
    let cardSpeech = ''

    function precisionRound(number, precision) {
      var factor = Math.pow(10, precision);
      return Math.round(number * factor) / factor;
    }

    if (portfolio.empty) {
        self.response.speak(` your balance is ${portfolio.balance.cash} dollars,  You have no positions in your portfolio. get in the game and buy something, issue me another command. `)
            .listen(`issue me another command`)
            .cardRenderer(` your balance is ${portfolio.balance.cash} dollars,  You have no positions in your portfolio, get in the game and buy something, issue me another command. `)
            .shouldEndSession(false)
        self.emit(':responseReady')
    } else {
      for (let i=0;i<portfolio.balance.positions.length;i++) {
        posList.push(portfolio.balance.positions[i].symbol)
      }
    }

    let costBasis = 0.0;
    let profitLoss = 0.0;
    // let totalpl = 0.0

    getQuotes(posList)
      .then(quotes => {

        let grossPL = 100000 - (portfolio.balance.costBasis - portfolio.balance.cash)
        speech = speech + ` your balance is $${portfolio.balance.cash} in cash, with a cost basis of $${portfolio.balance.costBasis} on your portfolio. the profit or loss is $${portfolio.balance.bookedpl}. `

        cardSpeech = cardSpeech + ` your balance is $${portfolio.balance.cash} in cash with a cost basis of $${portfolio.balance.costBasis} on your portfolio. `

        for (var i=0;i<quotes.length;i++) {
          profitLoss = precisionRound(((quotes[i].last_price * portfolio.balance.positions[i].qty) - portfolio.balance.positions[i].costBasis),2)

          if (profitLoss > 0) {
            speech = speech + ` on your position of ${portfolio.balance.positions[i].qty}  <say-as interpret-as="spell-out">${quotes[i].symbol}</say-as>, you have a profit of $${profitLoss},`

            cardSpeech = cardSpeech + ` on your position of ${portfolio.balance.positions[i].qty}  ${quotes[i].symbol} you have a profit of $${profitLoss},`

          } else {
            speech = speech + ` on your position of ${portfolio.balance.positions[i].qty} <say-as interpret-as="spell-out">${quotes[i].symbol}</say-as>, you have a loss of $${profitLoss},`

            cardSpeech = cardSpeech + ` on your position of ${portfolio.balance.positions[i].qty} ${quotes[i].symbol} you have a loss of $${profitLoss},`
          }
        }  
        self.response.speak(` ${speech}. issue me another command `)
          .listen(`issue me another command`)
          .cardRenderer(` ${cardSpeech} , issue me another command `)
          .shouldEndSession(false)
        self.emit(':responseReady')
    })
  },

  'LaunchRequest' : function() {
    console.log('Launch Request intent: ',JSON.stringify(this.event))
    this.emit(':ask', `issue me another command`,`issue me another command`);
  },

  'QuoteIntent' : function() {

    console.log('Quote intent: ',JSON.stringify(this.event))
    let self = this;
    let speech =''
    let cardSpeech=''

      // returns true if resolutions exist
      if (checkQuoteReq(this.event)) {

          let symbol = (this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].values[0].value.id);
          console.log(symbol)
          let symbolName = this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].values[0].value.name;
          console.log(symbolName)

          getQuote(symbol)
            .then(quote => {
              speech = ( `<say-as interpret-as="spell-out">${quote.symbol}</say-as> is $${quote.last_price}, issue me another command `)
              cardSpeech = (`${quote.symbol} is $${quote.last_price}, issue me another command `)
              self.response.speak(speech)
                  .listen(`issue me a command`)
                  .shouldEndSession(false)
              self.emit(':responseReady')
            })
            .catch(err => {
              self.emit(':ask',`sorry, we do not cover that instrument, try again or ask for help`,`try again or ask for help`)
            });
      } else {
        this.emit(':ask',`sorry, we do not cover that instrument, try again or ask for help`,`try again or ask for help`)
      }
  },

  'DetailedQuoteIntent' : function() {
      console.log('Detailed Quote intent: ',JSON.stringify(this.event))  
      
      // returns true if resolutions exist
      if (checkQuoteReq(this.event) ) {

          let self=this;
          let symbol=(this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].values[0].value.id);
          let symbolName = this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].values[0].value.name;   

          getQuote(symbol)
            .then(quote => {
              self.response.speak(`<say-as interpret-as="spell-out">${quote.symbol}</say-as> is $${quote.bid} and offered at $${quote.ask}. the high is $${quote.high}, the low, is $${quote.low}. on Volume of ${quote.volume}. give me another command `)
                  .listen(`give me another command `)
                  .cardRenderer(`${quote.symbol} is $${quote.bid} and offered at $${quote.ask}. the high is $${quote.high}, the low, is $${quote.low}. on Volume of ${quote.volume}. give me another command `)
                  .shouldEndSession(false)
              self.emit(':responseReady')
            })
            .catch(err => {
              self.response.speak(`Something went wrong and we could not fulfill your request, try issuing another command.`)
                  .listen(`issue a command, or ask for help.`)
                  .cardRenderer(`Something went wrong and we could not fulfill your request, try issuing another command.`)
                  .shouldEndSession(false)
              self.emit(':responseReady')
            })
      } else {
        self.response.speak(`Something went wrong and we could not fulfill your request, try issuing another command.`)
            .listen(`issue a command, or ask for help.`)
            .cardRenderer((`Something went wrong and we could not fulfill your request, try issuing another command.`))
            .shouldEndSession(false)
        self.emit(':responseReady')
      }
  },

  'DescribeIntent' : function() {
    console.log('Describe intent: ',JSON.stringify(this.event))

    // returns true if resolutions exist
    if (checkQuoteReq(this.event) ) {      

        let getDescriptions = require('./functions/getDescriptions')
        let self=this;
        let symbol=this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].values[0].value.id
        let symbolName = this.event.request.intent.slots.symbol.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        getDescriptions(symbol, function(err,speech,cardSpeech) {      
          if (err) {
            self.emit('DescribeRandomIntent');
          } else {
            console.log('cardSpeech : ',cardSpeech)
            self.emit(':askWithCard', speech + `. issue me another command`,`try again or ask for help`,'crypto description',cardSpeech)
            // self.response.speak(speech)
            //     .cardRenderer(cardSpeech)
            //     .listen(`try again or ask for help`)
            //     .shouldEndSession(false)
            // self.emit(':responseReady')
          }
        })
    } else {
      this.emit('DescribeRandomIntent')
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
        self.response.speak(`${speech}, issue me another command`)
            .listen(`issue me another command`)
            .cardRenderer(data, `issue me another command`)
            .shouldEndSession(false)
        self.emit(':responseReady')
      }
    })
  },

  'BriefMeIntent' : function(){
    let self = this;
    let speech = ''
    //let positions = this.attributes['portfolio.balance.positions'];
    
    getQuotes(watchlist)
      .then(quotes => {
        let speech=''
        for (var i=0;i<quotes.length;i++) {
          speech = speech + `<say-as interpret-as="spell-out">${quotes[i].symbol}</say-as> is $${quotes[i].last_price}.`
        }  
        self.response.speak(`${speech}, issume me another command`) 
            .listen(`Issue me another command`)
            .cardRenderer(`${speech}, issue me another command`)
            .shouldEndSession(false)
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

        this.attributes['symbol'] = symbol
        this.attributes['action'] = action

        var idx = watchlist.indexOf(symbol);

        if ((idx == -1 ) && (action == 'remove')) {
            action = 'rejectremove'

        } else if ((idx != -1 ) && (action == 'add')) {
            action = 'rejectadd'

        } else if ((idx == -1 ) && (action == 'add')) {
            // add symbol to watch list
            watchlist.push(symbol)
            self.attributes['watchlist'] = watchlist

        } else if ((idx != -1 ) && (action == 'remove')) {
            // remove symbol from watch list
            watchlist.splice(idx,1)
            self.attributes['watchlist'] = watchlist
        }
    } else {
      this.emit('Unhandled') // ill formated request
    }
    switch (action) {
      case 'rejectremove' :
        speech = (':ask',"That Symbol is not in the watchlist, try another command or ask for help", "try another command or ask for help")
      case 'rejectadd' :
        speech = (':ask', "that symbol is already in your watchlist, try another command or ask for help", "try another command or ask for help")
      case 'add' :
        speech = (':ask', `you successfully added,<say-as interpret-as="spell-out">${symbol}</say-as> to your watchlist, issue me another command`,`issue me another command`)
        break;
      case 'remove' :
        speech =(':ask', `you successfully removed,<say-as interpret-as="spell-out">${symbol}</say-as> from your watchlist, issue me another command`,`issue me another command`)
        break;
    }
    this.response.speak(`${speech}`)                                        
        .listen(`issue me another command`)
        .cardRenderer( `${speech}`)
        .shouldEndSession(false)
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
                self.emit(':responseReady') }
            else {
                  let price = order.price/100
                  self.attributes['portfolio'] = portfolio
                  self.response.speak(`your order ${order.side} ${order.qty} <say-as interpret-as="spell-out">${order.symbol}</say-as> was ${order.state} at a price of $${price}, issue me another command `)
                    .cardRenderer(`your order ${order.side} ${order.qty} ${order.symbol} was ${order.state}  at a price of $${price}, issue me another command `)
                    .listen(`issue me another command`)
                    .shouldEndSession(false)
                  self.emit(':responseReady')
            }
          })
    } else {
      this.response.speak(`sorry, you did not provide enough information to provide a response., try again or ask for help`) 
          .listen(`try again or ask for help`)
          .cardRenderer(`sorry, you did not provide enough information to provide a response., try again or ask for help`)
          .shouldEndSession(false)
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

        cardSpeech = cardSpeech + ` your balance is $${cash} in cash with a cost basis of $${costBasis} on your portfolio. your booked profit or loss is $${bookedpl}. `

        for (var i=0;i<quotes.length;i++) {

          profitLoss = ((quotes[i].last_price * portfolio.balance.positions[i].qty) - portfolio.balance.positions[i].costBasis)

          totalpl += profitLoss

          if (profitLoss > 0) {
              speech = speech + ` on your position of ${portfolio.balance.positions[i].qty}  <say-as interpret-as="spell-out">${quotes[i].symbol}</say-as>, you have a profit of $${profitLoss},`

              cardSpeech = cardSpeech + ` on your position of ${portfolio.balance.positions[i].qty}  ${quotes[i].symbol} you have a profit of $${profitLoss},`

          } else {
              speech = speech + ` on your position of ${portfolio.balance.positions[i].qty} <say-as interpret-as="spell-out">${quotes[i].symbol}</say-as>, you have a loss of $${profitLoss},`

              cardSpeech = cardSpeech + ` on your position of ${portfolio.balance.positions[i].qty} ${quotes[i].symbol} you have a loss of $${profitLoss},`
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
          .cardRenderer(` ${cardSpeech} , issue me another command `)
          .shouldEndSession(false)
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
        .cardRenderer(`Help`,`${responseSpeech}`)
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