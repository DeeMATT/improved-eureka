"use strict";

var ejs = require("ejs");

var buildTemplate = function buildTemplate(templateString, data) {
  try {
    var template = ejs.compile(templateString);
    var html = template(data);

    return html;
  } catch (error) {
    throw error;
  }
};

module.exports = buildTemplate;