var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var RecordSchema = new Schema({
  code :String,
  english :String,
  german :String,
  french :String,
  italian :String,
  record_id :Number,
  updated_at :Date
});

module.exports = mongoose.model('Record', RecordSchema);

