var express = require('express');
var router = express.Router();
var request = require('request');
/*var app=require('app');
var server = app.listen( process.env.PORT || 7000);
var io = require('socket.io').listen(server);
*/

/* GET home page. 
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
*/

function scrape(urlstr, collection,req){
	setInterval(function(){
	request(urlstr,function(e,json){
	if(e) console.log("error with scraping");
	console.log("Connecting..."+json+e);
		var body = json.body;
		var jbody=JSON.parse(body);
		var btc_usd=jbody.btc_usd;
		console.log(btc_usd+" "+btc_usd.ave);
		var newItem={"pair":"BTC-USD","url":"https://btc-e.com/api/3/ticker/btc_usd","usd":btc_usd.avg,"btc":1,"volume":btc_usd.vol,"time":btc_usd.last};
		collection.insert(newItem);		
		req.io.sockets.emit('info',newItem);	
		
	});
	},30000);
		
}

var db;
/* Get Main page */
router.get('/',function(req,res){
	db = req.db;
	var collection = db.get('source');		
	collection.find({},function(e,docs){
			res.render('main',{
				"items" : docs
			});			
		});	
	//btc-e.com

var urlstr= "https://btc-e.com/api/3/ticker/btc_usd";
//setInterval(scrape(urlstr,collection),2000);
scrape(urlstr,collection,req);
	
});



//get the new url from form to add
//into databse and start parsing
router.post('/', function(req,res){
var newUrl=req.newUrl;
console.log(newUrl);
});


module.exports = router;