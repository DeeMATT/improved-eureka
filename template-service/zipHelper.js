const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");

const unzipFile = async (file, output) => {
  try {
    const filePath = path.resolve(__dirname, "files", file);
    const outputPath = path.resolve(__dirname, "files", output);

    const zip = new AdmZip(filePath);
    zip.extractAllTo(/*target path*/ outputPath, /*overwrite*/ true);

    return outputPath;
  } catch (error) {
    throw error;
  }
};

const zipDir = (dirPath) => {
  try {
    var zip = new AdmZip();

    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const filePath = path.resolve(__dirname, dirPath, file);

      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        zip.addLocalFolder(filePath, file);
      } else {
        zip.addLocalFile(filePath);
      }
    });

    const outputDir = `${dirPath}.zip`;

    zip.writeZip(outputDir);

    fs.rmdirSync(dirPath, { recursive: true });

    return outputDir;
  } catch (error) {
    throw error;
  }
};

module.exports = { unzipFile, zipDir };
