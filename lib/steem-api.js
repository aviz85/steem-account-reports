var steem = require('steem');
var Promise = require('bluebird');

function ping(){
	return new Promise(function(resolve,reject)		{

//			resolve('hello world');
			setTimeout(resolve,3000);
	});
}
function getAccountHistory(account){
	return new Promise(function(resolve, reject){
		steem.api.getAccountHistory(account,-1,0,function(resolve,reject,account){ return function(err,res){if (err) reject(err); var trx_cnt = res[0][0];
		steem.api.getAccountHistory(account,trx_cnt,((trx_cnt-1)>10000)?10000:trx_cnt-1,function(resolve,reject){return function(err,res){if(err) reject(err); resolve(res);}}(resolve,reject))}}(resolve,reject,account));
	});
}
function getOperations (account){
	return new Promise(function(resolve,reject){
		getAccountHistory(account).then(function(res){
			var ops = [];
			ops = res.map(function(t){var ts = t[1].timestamp; for (var i =0; i<t[1].op.length; i++){t[1].op[i].timestamp = ts} return t[1].op}).map(function(o){o[1].operation_type = o[0]; return o[1]});
			resolve(ops);
		}
		
		)
	});
	
}
module.exports = { 
	getAccountHistory: getAccountHistory,
	ping: ping,
	getOperations: getOperations	
}