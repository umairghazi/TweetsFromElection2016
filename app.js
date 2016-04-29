var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var colors = require('colors');
var twitter = require('ntwitter');
var credentials = require('./credentials.js');
var t = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});

var mongo = require('mongodb');
var Server = mongo.Server,
    Db = mongo.Db,
    assert = require('assert'),
    BSON = mongo.BSONPure;



var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var locations = {
    sf: '-122.75,36.8,-121.75,37.8',
    nyc: '-74,40,-73,41',
    all: '-180,-90,180,90'
};



var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

// Connection URL 
var url = 'mongodb://localhost:27017/twitterstream';
// Use connect method to connect to the Server 
console.log("Connecting to local mongodb instance at port 27017....".bgCyan);
MongoClient.connect(url, function(err, db) {
    if (err) {
        console.log("Couldn't connect to mongodb :(. Please make sure there is a mongod instance running.".bgRed);
        console.log("Exiting..");
        process.exit();
    } else {
        console.log(colors.bgGreen.underline("Connected to mongodb successfully :)"));
        console.log("Running sample queries...");
        console.log("Query -- collection.find({}) -- will return all the document from collection.");
        var collection = db.collection('streamdata');
        // Find some documents 
        collection.find({"tweet.id":3653083512}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Found the following records...");
            console.dir(docs);
        });

        console.log("Query -- collection.find({'tweet.text': {$all:[/*trump.*/]}}) -- will return all the document containing the word trump.".magenta);
        // var collection = db.collection('streamdata');
        collection.find({"tweet.text":{$all:[/.*trump.*/ , /.*hate.*/]}}).toArray(function(err, docs) {
            //db.streamdata.find({"tweet.text" : {$all:[ /.*trump.*/, /.*hate.*/]}});
            assert.equal(err, null);
            console.log("Found the following records...");
            console.dir(docs);
        });
    }
});


// var findAllDocuments = function(db, callback) {
//     // Get the documents collection 
//     var collection = db.collection('streamdata');
//     // Find some documents 
//     collection.find({}).toArray(function(err, docs) {
//         assert.equal(err, null);
//         console.log("Found the following records...");
//         console.dir(docs);
//     });
// }




//Below code is to connect to twitterstream API and download the live tweets to the mongo database
//console.log("Connecting to local mongodb instance at port 27017....".yellow);
// var server = new Server('localhost', 27017, {auto_reconnect: true});
// db = new Db('twitterstream', server);
// db.open(function (err, db) {
//     if(err){
//         console.log("There was a problem connecting to the mongodb. Please make sure you have a mongod instance running at localhost:27017...".red);
//         process.exit();
//     }else{
//         console.log("Connected to the twitterstream database");
//     assert.equal(null, err);
//     t.stream('statuses/filter', {
//             language: "en",
//             track: ["Donald Trump","Hillary Clinton","Bernie Sanders","Elections 2016","US Presidential Elections"]
//         }, function (stream) {
//             stream.on('data', function (tweet) {
//                 var dataToSave = {};
//                 dataToSave.id = tweet.user.id;
//                 dataToSave.userName = tweet.user.name;
//                 dataToSave.location = tweet.user.location;
//                 dataToSave.profileImage = tweet.user.profile_image_url;
//                 dataToSave.coordinates = tweet.coordinates;
//                 dataToSave.createdAt = tweet.created_at;
//                 dataToSave.text = tweet.text;
//                 dataToSave.source = tweet.source;
//                 dataToSave.tweetId = tweet.id;
//                 db.collection('streamdata', function (err, collection) {
//                     collection.insert({'tweet': dataToSave}, {safe: true}, function (err, result) {
//                     });
//                 });
//             });
//         }
//     );
//     }
// });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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


module.exports = app;
