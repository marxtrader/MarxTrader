var constants = {

  // App-ID. TODO: Set Your App ID
  appId : 'amzn1.ask.skill.00ba4d3f-697f-45c0-a1da-fc3a92caea14',

  //  DynamoDB Table Name
  dynamoDBTableName : 'marx-trader',

  adminId : "amzn1.ask.account.AF5WEBXRUMTQKSJ6SQ2RHDAGFED3VOCK2M6DWEJPGFIA55YOJPR7RGLCI3JB3USPO6QBRMS7IUWCX3TXUNARTX3BZI3BQ54FZTK4GND4SZ3FANUZ2C2YREENB5ALEDZ7Q2N2Q56J6GUEOEFJ4JK7ORKAQ3AKSZALQYGDQQXSCS4QARW32DH2EELYJTQRBJFS7AYQ2TSVT52HTKQ",

  defaultWL : ['btcusd', 'ethusd', 'ltcusd'],
  
  initPortfolio : {
    "empty" : true,
    "balance" : {
      "cash" : 500000.00,
      "bookedpl":0.0,
      "costBasis":0.0,
      "positions" : []
    },
    "orders" :[],
    "algos" :[]
  },



  // Skill States
  // states : { 
  //   ONBOARDING : '',
  //   MAIN : '_MAIN',
  // }

  // Speech

};

module.exports = constants;
