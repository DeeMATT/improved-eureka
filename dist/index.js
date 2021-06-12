"use strict";

var _index = require("./digitalocean/index");

var express = require("express");
var app = express();
var templateService = require("./template-service");

var port = process.env.PORT || 5000;

app.use(express.json());

//app imports


app.get("/", async function (req, res) {
  return res.json({
    data: "welcome to lola serve"
  });
});

app.post("/lolasubdomain", async function (req, res) {
  var name = req.body.name;


  var result = await (0, _index.registerSubdomainForLolaFinance)(name);

  if (result.success) {
    return res.json(result);
  }

  return res.status(500).json(result);
});

app.use(templateService);

app.use(function (req, res, next) {
  var err = new Error();
  err.message = "Not found";
  err.name = "notfound";
  err.statusCode = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    name: err.name
  });
});

app.listen(port, function () {
  console.log("Lola Serve Is Running On Port " + port);
});