"use strict";

var express = require("express");
var router = express.Router();

var buildTemplate = require("./compiler");
var zipHandler = require("./fileHandler");

var _require = require("./zipHelper"),
    zipDir = _require.zipDir;

router.post("/generate-template", async function (req, res, next) {
  var _req$body = req.body,
      fileUrl = _req$body.fileUrl,
      data = _req$body.data;

  try {
    var file = await zipHandler(fileUrl);
    var templateFile = file.dirPath + "/index.html";

    // overwites the initial template index.html
    buildTemplate(templateFile, data);

    var templateZip = zipDir(file.dirPath);
    //Upload to main service
    //unlink file
  } catch (error) {
    next(error);
  }
});

module.exports = router;