global.__base = __dirname + '/';

var express = require('express');
var app = express();
var mongoose   = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://user:start123@localhost:27017/backend');
var db = mongoose.connection;
db.once('open', function () {
	console.log('connected.');
});

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true  }));
app.use(bodyParser.json());

app.use('/views', express.static(__base + 'views'));
app.use('/', require(__base + 'controllers/routes'));
//app.use('/BI-2', express.static(__base + '../BI-2'));
app.use('/node_modules', express.static(__base + 'node_modules'));

app.listen(32130);
console.log('API is running on port 32130');
