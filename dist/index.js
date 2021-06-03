'use strict';

var express = require('express');
var app = express();

var port = process.env.PORT || 5000;

app.get('/', async function (req, res) {
  return res.json({
    'data': 'welcome to lola serve'
  });
});

app.listen(port, function () {
  console.log('Lola Serve Is Running');
});