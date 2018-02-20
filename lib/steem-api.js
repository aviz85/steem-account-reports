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
		steem.api.getAccountHistory(account,0,1,function(r){return function(err,result){r(result);}}(resolve));
	});
}
function getOperations (account, op_type, from, duration){

}
module.exports = { 
	getAccountHistory: getAccountHistory,
	ping: ping,
	getOperations: getOperations	
}