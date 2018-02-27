const steem = require('steem'),
	Promise = require('bluebird'),
	Readable = require('stream').Readable,
	util = require('util');

var GetOperationsStream = function(account,opts) {
	this.account = account;
	Readable.call(this, {
		objectMode: true
	});
	this.opts = opts;
	this.curIndex = 0;
	this.limit = 100;
};

GetOperationsStream.prototype.getHistory = function(account, from, limit, opCount) {

	this.from = from;

	return new Promise(function(self){
		return function (resolve, reject) {
			steem.api.getAccountHistory(account, from, limit, function(err, result) {

				if (err) {
					console.log('ERR');
					console.log(err);
					reject(err);
				}
				var ops = [];
				ops = result.map(function(t) {
					var ts = t[1].timestamp;
					for (var i = 0; i < t[1].op.length; i++) {
						t[1].op[i].timestamp = ts
					}
					return t[1].op
				}).map(function(o) {
					o[1].operation_type = o[0];
					return o[1]
				})
				.filter(function(o){
					if (!self.opts.ops) return true;
					return (self.opts.ops.indexOf(o.operation_type)>-1)?true:false;
				});
				if(ops.length>1){
					resolve(JSON.stringify(ops));	
				}
				
			})
	}}(this));

}
util.inherits(GetOperationsStream, Readable);

GetOperationsStream.prototype._read = function() {
	if (this.curIndex++ === 0) {

		steem.api.getAccountHistory(this.account, -1, 0, (function(self) {
			return function(err, result) {
				self.opCount = result[0][0];

				return self.getHistory(self.account, self.opCount, self.limit, self.opCount).then(function(s) {
					return function(result) {
						s.push(result.slice(0, -1));
					}
				}(self));
			}
		})(this));
	} else {

		var fromOp = this.from - this.limit;
			if ((this.from - this.limit) < this.limit) {
				this.limit = this.from - this.limit;
			}
		return this.getHistory(this.account, fromOp, this.limit, this.opCount).then(function(s) {
			
			return function(result) {		
		if (s.from > 0) {
				s.push(',');
				s.push(result.slice(1, -1));				

		} else {
			s.push(']');
			return s.push(null);
		}
		};
		}(this));
	}
};

function ping() {
	return new Promise(function(resolve, reject) {

		//			resolve('hello world');
		setTimeout(resolve, 3000);
	});
}

function getAccountHistory(account) {
	return new Promise(function(resolve, reject) {
		steem.api.getAccountHistory(account, -1, 0, function(resolve, reject, account) {
			return function(err, res) {
				if (err) reject(err);
				var trx_cnt = res[0][0];
				steem.api.getAccountHistory(account, trx_cnt, ((trx_cnt - 1) > 10000) ? 10000 : trx_cnt - 1, function(resolve, reject) {
					return function(err, res) {
						if (err) reject(err);
						resolve(res);
					}
				}(resolve, reject))
			}
		}(resolve, reject, account));
	});
}

function getOperations_old(account) {
	return new Promise(function(resolve, reject) {
		getAccountHistory(account).then(function(res) {
				var ops = [];
				ops = res.map(function(t) {
					var ts = t[1].timestamp;
					for (var i = 0; i < t[1].op.length; i++) {
						t[1].op[i].timestamp = ts
					}
					return t[1].op
				}).map(function(o) {
					o[1].operation_type = o[0];
					return o[1]
				});
				resolve(ops);
			}

		)
	});

}

function getOperations(account,opts) {
	return new GetOperationsStream(account,opts);
}
module.exports = {
	getAccountHistory: getAccountHistory,
	ping: ping,
	getOperations: getOperations,
	GetOperationsStream: GetOperationsStream
}