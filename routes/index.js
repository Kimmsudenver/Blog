var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* Get Main page */
router.get('/main',function(req,res){
	res.render('main',{title: "Web Application Posts"});
	var db = req.db;
	var collection = db.get('posts');
	collection.find({},{},function(e,docs){
		console.log(docs);
		res.render('main',{
			"postItem" : docs
		});
	});

});
module.exports = router;