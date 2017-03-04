var express = require('express'),
    pug = require('pug'),
    mongo = require('mongodb'),
    assert = require('assert')

var app = express();
app.locals.pretty = true;

// Mongo setup
var MongoClient = mongo.MongoClient
var mongo_url = "mongodb://localhost:27017/deephack"

//MongoClient.connect(mongo_url, function(err, db) {
  //assert.equal(null, err);
  //popularTagsPipeline(db, function(results) {
    //db.close();
  //});
//});

// Get list of top 10 tags
var popularTagsPipeline = function(db, callback) {
  var collection = db.collection( 'hacks' );
  collection.aggregate( 
      [ { "$project": { "_id": 0, "tags": 1 } },
        { "$unwind" : "$tags" },
        { "$group"  : { "_id": "$tags", "count": {"$sum":  1} } },
        { "$sort"   : {"count" : -1 } },
        { "$limit"  : 10 }
      ],	  
	  function(err, results) {
        assert.equal(err, null);
        callback(results);
      }
  );
}

app.set('view engine', 'pug')

app.get('/', function (req, res) {
    MongoClient.connect(mongo_url, function(err, db) {
        assert.equal(null, err);
        popularTagsPipeline(db, function(results) {
            res.render('index', { title : 'this is my title', popularTags:results })
            db.close();
        });
    });
})

app.use('/static', express.static('static'))

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
