var config = require('config');
var api = require('./lib/steem-api.js');
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

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

io.on('connection', function(client) {  
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
    });
    client.on('query', function(data) {
	console.log('query: '+data);
	//api.getAccountHistory(data).then(function(res){
	api.getOperations(data).then(function(res){		
		res = res.filter(function(r){if (operations.indexOf(r.operation_type)>-1){return true;}else{ return false;}});
		console.log('results',res);
		client.emit('results',res);});	
	
    });
});

server.listen(config.get('socket.port'), function(){
	console.log('server: listening...');
});