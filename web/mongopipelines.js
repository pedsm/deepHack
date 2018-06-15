var mongo = require('mongodb'),
    assert = require('assert'),
    collection = null,
    rate = require('./score.js').rate

// Mongo setup
var MongoClient = mongo.MongoClient
var mongo_url = "mongodb://db:27017/deephack"
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

// Tag over the last year
var tagTrendsPipeline = function(tag_name, callback) {
    collection.aggregate(
            [
            { "$match"  : { tags : { $in : [tag_name]}}},
            { "$project": { "_id": 0,
                monthSubstring: { $substr: [ "$timestamp", 0, 7 ] },
            }},
            { "$group"  : { "_id": "$monthSubstring", "count": {"$sum": 1} } },
            { "$sort"   : { "_id": -1 }},
            { "$limit"  : 24 },
            { "$sort"   : { "_id": 1 }}
            ],
            function(err, results) {
                assert.equal(err, null);
                callback(results);
            }
    );
}


// Return a list of similar tags
var getRelatedTags = function(tag_name, callback) {
    collection.aggregate(
        [ { "$match"  : { tags : { $in : [tag_name]}}},
            { "$project": { "_id": 0, "tags": 1 } },
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
};

// Get the list of projects associated with a tag in decending popularity
var getProjectsWithTags = function(tag_name, callback) {
    var mres = collection.find({tags: {$in: [tag_name]}})
        .sort({"num_likes": -1});
    mres.toArray((err, documents) => {
        documents.forEach((document)=>
            {
                document.rating = rate(document.num_likes, document.num_comments, document.tags.length)
            })
        callback(documents)
    });
}

var getTagSuccessRate = function(tag_name, callback) {
    collection.aggregate(
        [ { "$match"  : { tags : { $in : [tag_name]}}},
            { "$project": { "_id": 0, "num_prizes": 1 } },
            { "$group"  : { "_id": "$num_prizes", "count": {"$sum":  1} } },
            { "$sort"   : {"count" : -1 } }
        ],
        function(err, results) {
            assert.equal(err, null);
            callback(results);
        }
    );
}

var getSearchResults = function(query, callback)
{
    // var regex = "/" + query + "/"
    var regex = new RegExp(query,'i')
    var arr = [] 
    arr.push(query)
    collection.find({name:regex}).toArray((err,documents)=>
        {
            if(err)
                throw err
            documents.forEach((document)=>
                {
                    document.rating = rate(document.num_likes, document.num_comments, document.tags.length)
                })
            collection.find({tags:{$in:arr}}).toArray((err,results)=>
                {
                    if(err)
                        throw err
                    callback(documents,results)
                })
        })
}


module.exports = {popularTagsPipeline, getProjectsWithTags, getRelatedTags, getTagSuccessRate, getSearchResults, tagTrendsPipeline}

