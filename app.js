var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var request = require('request');

//adding database
var mongo = require('mongodb');
var connect = require('connect');
var monk = require('monk');
var mongo = require('mongodb');
var mongostr= "mongodb://root:test@ds047940.mongolab.com:47940/heroku_app31160925";
var db = monk(mongostr);


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = app.listen( process.env.PORT || 5000);
var io = require('socket.io').listen(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//connect to database from app
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

/*
setInterval(function(){
   // var lastItem = api.find({},{last :{$slice:[1,2]}});
io.sockets.emit('info',"info to go to front end");
},3000);
*/
function scrape_btc_e(urlstr, collection){
    setInterval(function(){
    request(urlstr,function(e,json){
    if(e) console.log("error with scraping");
    console.log("Connecting..."+json+e);
        var body = json.body;
        var jbody=JSON.parse(body);
        var btc_values=jbody.ltc_btc;   
        var usd_values = jbody.ltc_usd; 
        var newItem={"pair":"LTC-BTC","url":"https://btc-e.com/api/3/ticker/ltc_btc-ltc_usd","usd":0,"btc":btc_values.avg,"volume":btc_values.vol,"time":btc_values.last};
        collection.insert(newItem); 
        var newItem={"pair":"LTC-BTC","url":"https://btc-e.com/api/3/ticker/ltc_btc-ltc_usd","usd":usd_values.avg,"btc":0,"volume":usd_values.vol,"time":usd_values.last};  
        collection.insert(newItem);
    });
    },3000);
        
}
var urlstr= "https://btc-e.com/api/3/ticker/ltc_btc-ltc_usd";
scrape_btc_e(urlstr,db.get('btc_edb'));



function scrape_cryptsy(urlstr, collection){
    setInterval(function(){
    request(urlstr,function(e,json){
    if(e) console.log("error with scraping");
    console.log("Connecting...");
        var body = json.body;
        var jbody=JSON.parse(body);
        var markets = jbody.return.markets;        
        var btc_values=markets.LTC/BTC;  
        var usd_values = jbody.LTC/USD;    
        var newItem={"pair":"LTC-BTC","url":"https://btc-e.com/api/3/ticker/ltc_btc-ltc_usd","usd":0,"btc":btc_values.lasttradeprice,"volume":btc_values.volume,"time":btc_values.lasttradetime};
        collection.insert(newItem); 
        var newItem={"pair":"LTC-BTC","url":"https://btc-e.com/api/3/ticker/ltc_btc-ltc_usd","usd":usd_values.lasttradeprice,"btc":0,"volume":usd_values.volume,"time":usd_values.lasttradetime};   
        collection.insert(newItem);
        console.log(newItem);
        
        
    });
    },3000);
        
}
var urlstr= "http://pubapi.cryptsy.com/api.php?method=marketdatav2";
scrape_cryptsy(urlstr,db.get('cryptsydb'));


module.exports = app;
