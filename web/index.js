var express = require('express'),
    pug = require('pug'),
    mongo = require('mongodb'),
    assert = require('assert'),
    mpipelines = require('./mongopipelines'),
    score = require('./score.js').rate()

var app = express();
app.locals.pretty = true;
app.set('view engine', 'pug')
app.use('/static', express.static('static'))

app.get('/', function (req, res) {
    mpipelines.popularTagsPipeline(function(results) {
        res.render('index', { title : 'this is my title', popularTags:results })
    });
})

app.get('/tags/:tag', function(req, res) {
    mpipelines.getProjectsWithTags(req.params.tag, function(tagProjects) {
        mpipelines.getRelatedTags(req.params.tag, function(relatedTags) {
            mpipelines.getTagSuccessRate(req.params.tag, function(tagSuccessRate){
                mpipelines.tagTrendsPipeline('javascript', function(trends) {
                    tagSuccessRate = tagSuccessRate.filter((x)=>x._id != null).slice(0, 3);
                    console.log(tagProjects[0].rating)
                    res.render('tag',
                        {
                            tagName: req.params.tag,
                            tagPopularity: tagProjects.length,
                            tagTopProjects: tagProjects,
                            tagRelatedTags: relatedTags,
                            tagSuccessRate: tagSuccessRate,
                            tagTrenddata: trends
                        }
                    );
                });
            });
        });
    });
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

