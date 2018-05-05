
// take the params object and an action put, get or update
const putToDynamo = function ( params, action, cb) { //,cb) {
          
    var AWS = require("aws-sdk");

    AWS.config.update({
    region: "us-east-1"
    });

    var docClient = new AWS.DynamoDB.DocumentClient()

    switch (action) {

        case ("update") :
            // update item
            docClient.update(params, function(err, data) {
                if (err) {
                    cb(err, null);
                } else {
                    cb(null, "success")
                }
            });
            break;

        case ("put") :
            // put item
            docClient.put(params, function(err, data) {
                if (err) {
                    cb(err, null);
                } else {
                    cb(null, "success")
                }
            });
            break;

        case ("get") :
            // get Item
            docClient.get(params, function(err, data) {
                if (err) {
                    cb(err, null);
                } else {
                    cb(null, data)
                }
            });
            break;
        case ("scan") :
            docClient.scan(params, function(err, data) {
                if (err) {
                    cb(err, null)
                } else {
                    cb(null, data)
                }
            });
            break;
    } // end switch
} // end function

var table = "marx-trader-users";

var upParams = {
    TableName: table,
    Key : {
        userIds : "chris",
    },
    AttributeUpdates: {
        somefield: {
          Action: "PUT",
          Value: "somefield update"
        },
        someotherfield:{
            Action :"PUT",
            Value : "someotherfield update"
        }
    }
};

var putParams = {
    TableName: table,
    Item : {
        userIds : "Device3", // replace with request.session.user.userId.value
        users : [
            {   deviceId : "4444",
                portfolio : {
                    "empty" : true,
                    "balance" : {
                        "cash" : 50000000,
                        "bookedpl":0.0,
                        "costBasis":0.0,
                        "positions" : []
                    },
                    "orders" :[],
                    "algos" :[]
                },
                watchlist : []
            },
        ]
    }
};

var getParams = {
    TableName: table,
    Key : {
        userIds : "peter"
    }
};

var scanparams = {
    TableName: table,
    Select: 'ALL_ATTRIBUTES', // optional (ALL_ATTRIBUTES | ALL_PROJECTED_ATTRIBUTES | 
};

flag = 4;

switch (flag) {

    case 1 :
    console.log('update')
        putToDynamo(upParams,"update", function(err,data){
            if (err) {
                console.log("err : ",err)
            } else {
                console.log("data : ",data)
            }
        })
        break;

    case 2 :
    console.log('put')
        putToDynamo(putParams,"put", function(err,data){
            if (err) {
                console.log("err : ",err)
            } else {
                console.log("data : ",data)
            }
        })
        break;

    case 3 :
    console.log('get')
        putToDynamo(getParams,"get", function(err,data){
            if (err) {
                console.log("err : ",err)
            } else {
                console.log("data : ",data)
            }
        })
        break;
    case 4 :
        putToDynamo(scanparams,"scan", function(err, data) {
            if (err) {
                console.log("err : ",err)
            } else {
                console.log("data : ",data)
            }
        });
}

