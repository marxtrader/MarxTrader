var skillId = 'amzn1.ask.skill.d3286ec7-f13e-4e59-aa35-b31af30f1dcd'
const sim = new (require('nodejs-smapi-simulator'))(skillId)

it('sim', () => {
  return sim.simulate('start space facts')
    .then(res => {
      console.log(
        JSON.stringify(res.skillExecutionInfo.invocationRequest.body.request),
        JSON.stringify(res.skillExecutionInfo.invocationResponse.body.response)
      )
    })
    .catch(console.log)
}, 20000)
