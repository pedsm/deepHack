var express = require('express'),
    pug = require('pug'),
    assert = require('assert'),
    mpipelines = require('./mongopipelines'),
    score = require('./score.js').rate()
    scraper = require('./scraper');

// Start the scraper
scraper();

var app = express();
app.locals.pretty = true;
app.set('view engine', 'pug')
app.use('/static', express.static('static'))

app.get('/', async function (req, res) {
    try {
        const popularTags = await mpipelines.popularTagsPipeline();
        const dataStats = await mpipelines.getDataStats();
        res.render('index', { popularTags, dataStats })
    } catch (err) {
        res.render('index', { err })
    }
})

app.get('/tags/:tag', async function(req, res) {
    try {
        const tagProjects = await mpipelines.getProjectsWithTags(req.params.tag);
        const relatedTags = await mpipelines.getRelatedTags(req.params.tag);
        let tagSuccessRate = await mpipelines.getTagSuccessRate(req.params.tag);
        const trends = await mpipelines.tagTrendsPipeline(req.params.tag);

        tagSuccessRate = tagSuccessRate.filter((x)=>x._id != null).slice(0, 3);
        res.render('tag', {
                tagName: req.params.tag,
                tagPopularity: tagProjects.length,
                tagTopProjects: tagProjects,
                tagRelatedTags: relatedTags,
                tagSuccessRate: tagSuccessRate,
                tagTrenddata: trends
            }
        );
    } catch (err) {
        res.render('tag', { err })
    }
});

app.get('/q/:q',(req,res)=>{
    var q = req.params.q;
    mpipelines.getSearchResults(q,(data,tags)=>
        {
            if(tags.length > 0)
                res.redirect('/tags/'+q)
            else
                res.render('search',{projects:data,q:q})
        })
})


const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", function () {
  console.log('Deephack running on port ' + port);
})
