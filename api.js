const express = require('express');
const router = express.Router();
const steemApi = require(appRoot + '/lib/steem-api.js');

router.get('/account/:username', function(req,res){
	var s = steemApi.getOperations(req.params.username);
	s.on('data',function(chunk){
		console.log(typeof(chunk));
		res.write(chunk);
		if(chunk == null){
			res.status(200).end();
		}
	});
	s.on('end',function(){
		res.status(200).end();
	});
});

module.exports = router;