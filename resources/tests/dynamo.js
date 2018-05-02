  
  const deviceId = "amzn1.ask.account.AESHTVDMAGM4CT2T63NFLW3LO3S3ECPH7XIRTOV7YHLYI7T74IWF3IBBWFSCRYGP5RTYRPMBZXGU7RRRFGAJAQEN2O6KKJLSQ6Z3TZAD7UVN535TT3NJLHF2TB3QCRFAHL4QG77XEI75AUWQYERAORXAY2PJGO2TPKISSIXRY6WR7EJQ5XZUTPIPJW477KZE4KKO7UDKWJYB2DQ"
  
  const getCustomerAccountData = function (userId) { //,cb) {
          
      var AWS = require("aws-sdk");
  
      AWS.config.update({
      region: "us-east-1"
      });
  
      var docClient = new AWS.DynamoDB.DocumentClient()
      var table = "marx-trader";
  
      var params = {
          TableName: table,
          Key:{
              "userId": userId
          }
      };
  
      docClient.get(params, function(err, data) {
          if (err) {
              console.error("Error ; ", JSON.stringify(err, null, 2));
          } else {
             console.log(JSON.stringify(data))
          }
      });
  }
  getCustomerAccountData(deviceId)