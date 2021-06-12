"use strict";

var ejs = require("ejs");
var fs = require("fs");

var buildTemplate = function buildTemplate(templateFile, data) {
  try {
    var templateString = fs.readFileSync(templateFile).toString();

    var template = ejs.compile(templateString);
    var html = template(data);

    fs.writeFileSync(templateFile, html);
  } catch (error) {
    throw error;
  }
};

module.exports = buildTemplate;