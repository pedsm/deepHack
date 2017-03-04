var express = require('express'),
    pug = require('pug'),
    mongo = require('mongodb'),
    assert = require('assert')
    mpipelines = require('./mongopipelines')

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
    mpipelines.getProjectsWithTags(req.params.tag,
            (documents) => res.render('tag',
                {
                    tagName: req.params.tag,
                    tagPopularity: documents.length,
                    tagTopProjects: documents
                }
            ));
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

