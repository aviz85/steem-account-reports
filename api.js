const express = require('express');
const router = express.Router();
const steemApi = require(appRoot + '/lib/steem-api.js');

router.get('/account/:username', function(req,res){
	var ops = req.query.ops;
	if (typeof(req.query.ops) === 'string'){
		ops = [req.query.ops];
	}
		
	opts = {
		ops: ops
	}
	steemApi.getOperations(req.params.username,opts).pipe(res);
});

module.exports = router;