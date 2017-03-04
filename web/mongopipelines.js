var mongo = require('mongodb'),
    assert = require('assert'),
    collection = null

// Mongo setup
var MongoClient = mongo.MongoClient
var mongo_url = "mongodb://localhost:27017/deephack"
MongoClient.connect(mongo_url, function(err, db) {
    collection = db.collection('hacks');
});


// Get list of top 10 tags
var popularTagsPipeline = function(callback) {
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

// Get the list of projects associated with a tag in decending popularity
var getProjectsWithTags = function(tag_name, callback) {
    var mres = collection.find({tags: {$in: [tag_name]}})
        .sort({"num_likes": -1});
    mres.toArray((err, documents) => callback(documents));
}

module.exports = {popularTagsPipeline, getProjectsWithTags}

