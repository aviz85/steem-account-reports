var config = require('config');
var api = require('./lib/steem-api.js');
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

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
	api.getAccountHistory(data).then(function(res){console.log(res);});	
	
    });
});

server.listen(config.get('socket.port'), function(){
	console.log('server: listening...');
});