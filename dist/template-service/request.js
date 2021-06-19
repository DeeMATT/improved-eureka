"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deployFile = exports.getFile = undefined;

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _formData = require("form-data");

var _formData2 = _interopRequireDefault(_formData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getFile = exports.getFile = async function getFile(url) {
  try {
    var _ref = await _axios2.default.get(url, {
      responseType: "arraybuffer"
    }),
        data = _ref.data;

    return data;
  } catch (error) {
    throw error;
  }
};

var deployFile = exports.deployFile = async function deployFile(domain, payload) {
  var formData = new _formData2.default();

  formData.append("template_files", payload, "out.zip");

  domain = domain.replace(/[.,\s]/g, "_");

  try {
    var _ref2 = await _axios2.default.post("https://templates.lolafinance.com/api/upload-template/" + domain, formData, {
      headers: formData.getHeaders()
    }),
        data = _ref2.data;

    return data;
  } catch (error) {
    throw error;
  }
};