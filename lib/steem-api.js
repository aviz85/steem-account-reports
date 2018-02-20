var steem = require('steem');
var Promise = require('q');

function getOperations (account, op_type, from, duration){
	return new Promise(function(reject,resolve)		{
			resolve('hello world');
		})

}
module.exports = { 
	getOperations: getOperations	
}