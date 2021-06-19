"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _jszip = require("jszip");

var _jszip2 = _interopRequireDefault(_jszip);

var _compiler = require("./compiler");

var _compiler2 = _interopRequireDefault(_compiler);

var _request = require("./request");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post("/generate-template", async function (req, res, next) {
  var _req$body = req.body,
      fileUrl = _req$body.fileUrl,
      dataSpec = _req$body.dataSpec,
      domain = _req$body.domain;


  if (!fileUrl) return res.json({
    success: false,
    message: "fileUrl is missing in request body"
  });

  if (!dataSpec) return res.json({
    success: false,
    message: "dataSpec is missing in request body"
  });

  if (!domain) return res.json({
    success: false,
    message: "domain is missing in request body"
  });

  try {
    var fileData = await (0, _request.getFile)(fileUrl);

    var newZip = new _jszip2.default();
    var zip = await newZip.loadAsync(fileData);
    var templateString = await zip.file("index.html").async("string");

    var html = (0, _compiler2.default)(templateString, dataSpec);

    zip.file("index.html", html);

    var result = zip.generateNodeStream({
      type: "nodebuffer",
      streamFiles: true
    });

    var deployData = await (0, _request.deployFile)(domain, result);

    return res.json({
      success: true,
      message: "done",
      data: deployData
    });
  } catch (error) {
    next(error);
  }
});

exports.default = router;