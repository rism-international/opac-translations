var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var RecordSchema = new Schema({
  title :String,
  record_id :Number,
  updated_at :Date
});

module.exports = mongoose.model('Record', RecordSchema);

