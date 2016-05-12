var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var bodyParser = require("body-parser");
var Server = mongo.Server;
var path = require('path');
var cors = require('cors');

// var monk = require('monk');
// var db = monk('localhost:27017/twitterstream');
var ObjectId = require('mongodb').ObjectID;

var assert = require('assert');
var app = express();



/* Following will get all the 20K tweets from database. USE WITH CAUTION */
// router.get('/search', function(req, res, next) {
//     var MongoClient = require('mongodb').MongoClient;
//     var assert = require('assert');
//     console.log("here");

//     var url = 'mongodb://localhost:27017/twitterstream';
//     MongoClient.connect(url, function(err, db) {
//         if (err) {
//             console.log("Couldn't connect to mongodb :(. Please make sure there is a mongod instance running.".bgRed);
//             console.log("Exiting..");
//             process.exit();
//         } else {
//             console.log("Connected to mongodb successfully :)");
//             console.log("Running sample queries...");
//             console.log("Query -- collection.find({}) -- will return all the document from collection.");
//             var collection = db.collection('streamdata');
//             // Find some documents 
//             collection.find({ "tweet.userName": "Allie4Cruz" }).toArray(function(err, docs) {
//                 assert.equal(err, null);
//                 console.log("Found the following records...");
//                 console.dir(docs);
//                 res.json(docs);
//             });
//         }
//     });
// });

router.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
});

router.get('/home', cors(), function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendFile(path.join(__dirname + '/client/index.html'));
});

//*** MAGIC happens here *** //
//*** Below route takes the query string sent by user on the URL http://localhost:3000/search/search?string=a&string=b
//if its a single word, then its treated as a string, if multiple words are sent, then its treated as an array
//So I am checking for the types below
//The strings are then converted into regular expressions where it will look for any occurances of the queries.

router.get('/search', function(req, res) {

    var query = req.query.string;
    console.log(query);
    var regEx = new Array();
    if (typeof query === 'string') {
        regEx.push(new RegExp(".*" + query + ".*"));
    } else {
        for (str in query) {
            regEx.push(new RegExp(".*" + query[str] + ".*"));
        }
    }
    console.log(regEx);
    // var regEx = new RegExp(".*"+search+".*");
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost:27017/twitterstream';
    MongoClient.connect(url, function(err, db) {
        if (err) {
            res.send("Couldn't connect to mongodb :(. Please make sure there is a mongod instance running.".bgRed);
            res.send("Exiting..");
            process.exit();
        } else {
            var collection = db.collection('streamdata');
            collection.find({ "tweet.text": { $all: regEx } }, { limit: 5000 }).toArray(function(e, docs) {
                res.json(docs);
                db.close();
            });
        }
    });
});

router.get('/getTweetData/:tweetId', function(req, res) {
    var id = parseInt(req.params.tweetId);
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost:27017/twitterstream';
    MongoClient.connect(url, function(err, db) {
        if (err) {
            res.send("Couldn't connect to mongodb :(. Please make sure there is a mongod instance running.");
            res.send("Exiting..");
            process.exit();
        } else {
            var collection = db.collection('streamdata');
            collection.find({ "tweet.id": id }).toArray(function(e, docs) {
                res.json(docs);
                db.close();
            });
        }
    });
});


router.post('/postComment', function(req,res){
    var id = req.body.id;
    var comment = req.body.comment;
    var time = req.body.time;
    console.log(id + " | " + comment + " | " + time);
     var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost:27017/twitterstream';
    MongoClient.connect(url, function(err, db) {
        if (err) {
            res.send("Couldn't connect to mongodb :(. Please make sure there is a mongod instance running.");
            res.send("Exiting..");
            process.exit();
        } else {
            var collection = db.collection('streamdata');
            collection.update({"_id": ObjectId(id)}, {$push: {"tweet.comment": {"comment":comment,time:time}}}, function(err,count){
                if(err){
                    console.log(err);
                }else{
                    console.log(count);
                    res.json({inserted:true,count:count});
                    db.close();
                }
            });
        }

    });

});


module.exports = router;
