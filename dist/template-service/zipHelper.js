"use strict";

var AdmZip = require("adm-zip");
var fs = require("fs");
var path = require("path");

var unzipFile = async function unzipFile(file, output) {
  try {
    var filePath = path.resolve(__dirname, "files", file);
    var outputPath = path.resolve(__dirname, "files", output);

    var zip = new AdmZip(filePath);
    zip.extractAllTo( /*target path*/outputPath, /*overwrite*/true);

    return outputPath;
  } catch (error) {
    throw error;
  }
};

var zipDir = function zipDir(dirPath) {
  try {
    var zip = new AdmZip();

    var files = fs.readdirSync(dirPath);

    files.forEach(function (file) {
      var filePath = path.resolve(__dirname, dirPath, file);

      var stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        zip.addLocalFolder(filePath, file);
      } else {
        zip.addLocalFile(filePath);
      }
    });

    var outputDir = dirPath + ".zip";

    zip.writeZip(outputDir);

    fs.rmdirSync(dirPath, { recursive: true });

    return outputDir;
  } catch (error) {
    throw error;
  }
};

module.exports = { unzipFile: unzipFile, zipDir: zipDir };