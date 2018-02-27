var config = require('config');
var path = require('path');
global.appRoot = path.resolve(__dirname);
var api = require('./api.js');
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  

var operations = ['transfer','curation_reward','producer_reward','author_reward','claim_reward_balance'];

//var operations = ['producer_reward'];

app.use(express.static(__dirname + '/bower_components'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});
app.get('/config', function(req, res, next){
    console.log('request config');
    res.sendFile(__dirname + '/config/default.json');
});
app.use('/api/v1', api);

server.listen(config.get('socket.port'), function(){
	console.log('server: listening...');
});