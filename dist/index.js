"use strict";

var _index = require("./digitalocean/index");

var _whogohost = require("./whogohost");

var _whogohost2 = _interopRequireDefault(_whogohost);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

app.post('/whogohost/purchase/domain', async function (req, res) {

  var result = await (0, _whogohost2.default)(req.body);

  if (result.success) {
    return res.json(result);
  }

  return res.status(500).json(result);
});

app.post('/domain', async function (req, res) {
  var _req$body = req.body,
      domain = _req$body.domain,
      redirectUrl = _req$body.redirectUrl;


  var result = await (0, _index.registerDomainForLolaFinance)(domain, redirectUrl);

  if (result.success) {
    return res.json(result);
  }

  return res.status(500).json(result);
});

app.post('/subdomain', async function (req, res) {
  var name = req.body.name;


  var result = await (0, _index.registerSubdomainForLolaFinance)(name);

  if (result.success) {
    return res.json(result);
  }

  return res.status(500).json(result);
});

app.listen(port, function () {
  console.log("Lola Serve Is Running On Port " + port);
});