var express = require('express'),
    pug = require('pug')
var app = express()

app.set('view engine', 'pug')

app.get('/', function (req, res) {
  res.render('index', { title : 'this is my title' })
})

app.use('/static', express.static('static'))

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
