
const roundIt = function (number, precision,callback) {
  var factor = Math.pow(10, precision);
  let num = Math.round(number * factor) / factor;
  callback(null, num)
}
module.exports = roundIt;


const roundIt = function(quote,percision) {
  key = (Object.keys(quote))
  Object.getOwnPropertyNames(quote).forEach(
    function (val, idx, array) {
      roundIt(quote[val], 2, function(err,data){
        if (!err) {
          return data
        }
      })
    }
  );
};
