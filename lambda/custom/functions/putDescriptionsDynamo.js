  
  const putDescriptionData = function (symbol,type,description) { //,cb) {
          
      var AWS = require("aws-sdk");
  
      AWS.config.update({
      region: "us-east-1"
      });
  
      var docClient = new AWS.DynamoDB.DocumentClient()
      var table = "marx-trader-coin-descriptions";
  
      var params = {
          TableName: table,
          Key:{
              "symbol": symbol,
              "type" : type
          }
          "descriptions" : description
      };
  
      docClient.put(params, function(err, data) {
          if (err) {
              console.error("Error ; ", JSON.stringify(err, null, 2));
              return 
          } else {
             console.log(JSON.stringify(data.Item.description))
          }
      });
  }
  putDescriptionData('btcusd','currency',description)