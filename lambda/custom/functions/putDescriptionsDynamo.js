
  const putDescriptionData = function (Item,description) { //,cb) {
          
        var AWS = require("aws-sdk");

        AWS.config.update({
        region: "us-east-1"
        });

        var docClient = new AWS.DynamoDB.DocumentClient()
        var table = "marx-trader-coin-descriptions";

        let item = {
            itemId : Item,
            another : "ok, looking good"
        }

        var params = {
            TableName: table,
            Item : item
        };
  
      docClient.put(params, function(err, data) {
          if (err) {
              console.error("Error ; ", JSON.stringify(err, null, 2));
              return 
          } else {
             console.log("success")
          }
      });
  }

  let description =  `<say-as interpret-as="spell-out">batusd</say-as>,Basic Attention Token radically improves the efficiency of digital advertising by creating a new token that can be exchanged between publishers, advertisers, and users. It all happens on the Ethereum blockchain. The token can be used to obtain a variety of advertising and attention based services on the Brave platform. The utility of the token is based on user attention, which simply means a person’s focused mental engagement.`

  putDescriptionData("avtusd",description)