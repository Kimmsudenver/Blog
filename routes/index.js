var express = require('express');
var router = express.Router();
var request = require('request');


// GET home page. 
router.get('/', function(req, res) {
  res.render('main', { title: 'Express' });
});





/* Get Main page */
router.get('/btc-e.com',function(req,res){
	var db = req.db;
	var collection = db.get('btc_edb');		
	collection.find({},function(e,docs){
			res.render('btc_e',{
				"btc_e" : docs
			});			
		});	
	
});

/* Get info from cryptsy.com */
router.get('/cryptsy',function(req,res){
	db = req.db;
	var collection = db.get('cryptsydb');		
	collection.find({},function(e,docs){
			res.render('cryptsy',{
				"cryptsy" : docs
			});			
		});		
});




//get the new url from form to add
//into databse and start parsing
router.post('/', function(req,res){
var newUrl=req.newUrl;
console.log(newUrl);
});


module.exports = router;