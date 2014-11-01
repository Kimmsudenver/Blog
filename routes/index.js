var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


/* Get Main page */
router.get('/main',function(req,res){
	var db = req.db;
	var collection = db.get('source');	
	collection.find({},function(e,docs){
		res.render('main',{
			"items" : docs
		});
	});	
});

module.exports = router;