let json = {
  "Items": [
    {
      "mapAttr": {
        "userName": "chris",
        "portfolio": {
          "algos": [],
          "orders": [
            {
              "timeStamp": "1525973346.5085976",
              "symbol": "btcusd",
              "side": "buy",
              "state": "not been filled, insufficient balance",
              "qty": 9010
            },
            {
              "timeStamp": "1525973577.4382505",
              "symbol": "btcusd",
              "side": "buy",
              "state": "not been filled, insufficient balance",
              "qty": 1000
            },
            {
              "timeStamp": "1525974694.9526513",
              "symbol": "btcusd",
              "side": "buy",
              "state": "has not been filled, insufficient balance",
              "reject": true,
              "qty": 1000
            },
            {
              "timeStamp": "1525974796.6224015",
              "symbol": "btcusd",
              "side": "buy",
              "state": "has not been filled, insufficient balance",
              "reject": true,
              "qty": 1000
            },
            {
              "timeStamp": "1525975063.9560006",
              "symbol": "btcusd",
              "side": "buy",
              "cost": 18334400,
              "reject": false,
              "price": 916720,
              "qty": 20,
              "state": "was filled"
            },
            {
              "timeStamp": "1525975229.034495",
              "symbol": "ltcusd",
              "side": "buy",
              "cost": 152740,
              "reject": false,
              "price": 15274,
              "qty": 10,
              "state": "was filled"
            },
            {
              "timeStamp": "1525975237.8154619",
              "symbol": "btcusd",
              "side": "sell",
              "proceeds": 4579900,
              "reject": false,
              "price": 915980,
              "qty": 5,
              "state": "was filled"
            },
            {
              "timeStamp": "1525975295.6201656",
              "symbol": "spkusd",
              "side": "buy",
              "cost": 19000,
              "reject": false,
              "price": 19,
              "qty": 1000,
              "state": "was filled"
            },
            {
              "timeStamp": "1526024812.4337516",
              "symbol": "btcusd",
              "side": "buy",
              "cost": 13042650,
              "reject": false,
              "price": 869510,
              "qty": 15,
              "state": "was filled"
            },
            {
              "timeStamp": "1526053300.3494973",
              "symbol": "ltcusd",
              "side": "buy",
              "cost": 700500,
              "reject": false,
              "price": 14010,
              "qty": 50,
              "state": "was filled"
            },
            {
              "timeStamp": "1526053363.029106",
              "symbol": "btcusd",
              "side": "buy",
              "cost": 8592000,
              "reject": false,
              "price": 859200,
              "qty": 10,
              "state": "was filled"
            },
            {
              "timeStamp": "1526060452.1284633",
              "symbol": "btcusd",
              "side": "buy",
              "cost": 8617000,
              "reject": false,
              "price": 861700,
              "qty": 10,
              "state": "was filled"
            },
            {
              "timeStamp": "1526060510.4781766",
              "symbol": "spkusd",
              "side": "buy",
              "cost": 180000,
              "reject": false,
              "price": 18,
              "qty": 10000,
              "state": "was filled"
            }
          ],
          "balance": {
            "bookedpl": -3700,
            "costBasis": 45054690,
            "positions": [
              {
                "symbol": "btcusd",
                "costBasis": 44002450,
                "avgprice": 880049,
                "qty": 50
              },
              {
                "symbol": "ltcusd",
                "costBasis": 853240,
                "avgprice": 14220.666666666666,
                "qty": 60
              },
              {
                "symbol": "spkusd",
                "costBasis": 199000,
                "avgprice": 18.09090909090909,
                "qty": 11000
              }
            ],
            "cash": 4941610
          },
          "empty": false
        },
        "watchlist": [
          "btcusd",
          "ethusd",
          "ltcusd",
          "xrpusd"
        ]
      },
      "userId": "amzn1.ask.account.AESHTVDMAGM4CT2T63NFLW3LO3S3ECPH7XIRTOV7YHLYI7T74IWF3IBBWFSCRYGP5RTYRPMBZXGU7RRRFGAJAQEN2O6KKJLSQ6Z3TZAD7UVN535TT3NJLHF2TB3QCRFAHL4QG77XEI75AUWQYERAORXAY2PJGO2TPKISSIXRY6WR7EJQ5XZUTPIPJW477KZE4KKO7UDKWJYB2DQ"
    },
    {
      "mapAttr": {
        "userName": "Ben",
        "portfolio": {
          "algos": [],
          "orders": [],
          "balance": {
            "bookedpl": 0,
            "costBasis": 0,
            "positions": [],
            "cash": 50000000
          },
          "empty": true
        },
        "watchlist": [
          "btcusd",
          "ethusd",
          "ltcusd",
          "xmrusd"
        ]
      },
      "userId": "amzn1.ask.account.AHNZ2J73VLI5QJ7OFQKOFTPSBCLEVHMDV4S6QLZGBJW2XSOVLS35Y6DVUKE2STZY3KG4C55KLLQUZZN2XR4D5OLQR6DORK4G6DQNOX6Z5O5BU4666THX3QQHS5E5ITYYEJB3X32T2V4NT7WU23YYUZ432WIU2GVKWASNCMPRJXMD6XTKTEFU4JZSNYW6O5S2MXHZTBDLANWNTSQ"
    }
  ],
  "Count": 2,
  "ScannedCount": 2
}

console.log(json.Items.length)