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
		steem.api.getAccountHistory(account,-1,5,function(resolve,reject){ return function(err,result){if (err) reject(err); resolve (result);}}(resolve,reject));
	});
}
function getOperations (account, op_type, from, duration){

}
module.exports = { 
	getAccountHistory: getAccountHistory,
	ping: ping,
	getOperations: getOperations	
}