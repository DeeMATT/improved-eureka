"use strict";

var axios = require("axios");
var uuid = require("uuid");
var fs = require("fs");
var Path = require("path");

var _require = require("./zipHelper"),
    unzipFile = _require.unzipFile;

var fileHandler = async function fileHandler(fileUrl) {
  var fileID = uuid.v4();
  var fileName = fileID + "." + Path.extname(fileUrl);
  var _path = Path.resolve(__dirname, "files", fileName);

  try {
    var writer = fs.createWriteStream(_path);

    var response = await axios({
      url: fileUrl,
      method: "GET",
      responseType: "stream"
    });

    response.data.pipe(writer);

    return new Promise(function (resolve, reject) {
      var finish = async function finish() {
        var dirPath = await unzipFile(_path, fileID);
        fs.unlinkSync(_path);

        resolve({ dirPath: dirPath });
      };

      writer.on("finish", finish);
      writer.on("error", function (error) {
        return reject({ msg: "file process error", err: error });
      });
    });
  } catch (error) {
    fs.unlinkSync(_path);
    throw error;
  }
};

module.exports = fileHandler;