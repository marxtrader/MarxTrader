require('isomorphic-fetch')
var fs = require('fs');
var nock = require('nock')

var askConfigPath = '/home/ec2-user/.ask/cli_config'
var obj = JSON.parse(fs.readFileSync(askConfigPath, 'utf8'))
var refreshToken = obj.profiles.default.token.refresh_token
//console.log(refreshToken)

var skillId = 'amzn1.ask.skill.d3286ec7-f13e-4e59-aa35-b31af30f1dcd'
var url = `https://api.amazonalexa.com/v1/skills/${skillId}/simulations`

var headers = {
  'Authorization': refreshToken,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Amzn-RequestId': '12345'
}

//console.log(headers)

var body = {
  input: {
    "content": "start space facts"
  },
  device: {
    "locale": "en-US"
  }
}

var opts = {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(body)
}

/*
var n = nock(/.+/)
  .post(/.+/)
  .reply(function(uri, reqBody) {
    console.log(reqBody)
    //console.log(JSON.stringify(this.req))
  })

fetch(url, opts)
  .then(res => {
    console.log(res.status)
    console.log(res.statusText)
    console.log(res.headers)
  })
*/

//console.log(apiBase)
/*
var n = nock(/.+/)
  .post(/.+/)
  .reply(function(uri, reqBody) {
    console.log(reqBody)
    console.log(JSON.stringify(this.req))
  })
*/

const simulator = new (require('nodejs-smapi-simulator'))(
    skillId,
    { // optional parameters
        poolingInterval : 500,
        locale : 'en-US'
    }
);

test('sim', () => {
  return simulator.simulate('start space facts')
    .then( function(result) {
      console.log(JSON.stringify(result))
    }, function(err) {
      console.log(err)
    })
}, 20000)
            