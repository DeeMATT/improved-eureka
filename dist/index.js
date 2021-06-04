'use strict';

var _index = require('./digitalocean/index');

var express = require('express');
var app = express();

var port = process.env.PORT || 5000;

app.use(express.json());

//app imports


app.get('/', async function (req, res) {
  return res.json({
    'data': 'welcome to lola serve'
  });
});

app.post('/lolasubdomain', async function (req, res) {
  var name = req.body.name;


  var result = await (0, _index.registerSubdomainForLolaFinance)(name);

  if (result.success) {
    return res.json(result);
  }

  return res.status(500).json(result);
});

app.listen(port, function () {
  console.log('Lola Serve Is Running On Port ' + port);
});