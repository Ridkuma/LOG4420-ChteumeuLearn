var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports.mongoose = mongoose;
module.exports.Schema = Schema;
// Connect to cloud database
var username = "chteumeulearn";
var password = "LOG4420";
var address = "@ds051740.mongolab.com:51740/chteumeulearn"; 
connect();
// Connect to mongo
function connect() {
  var url = 'mongodb://' + username + ':' + password + address;
  mongoose.connect(url);
}
function disconnect() {mongoose.disconnect()}

