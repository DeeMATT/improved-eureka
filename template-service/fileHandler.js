const axios = require("axios");
const uuid = require("uuid");
const fs = require("fs");
const Path = require("path");
const { unzipFile } = require("./zipHelper");

const fileHandler = async (fileUrl) => {
  const fileID = uuid.v4();
  const fileName = `${fileID}.${Path.extname(fileUrl)}`;
  const _path = Path.resolve(__dirname, "files", fileName);

  try {
    const writer = fs.createWriteStream(_path);

    const response = await axios({
      url: fileUrl,
      method: "GET",
      responseType: "stream",
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      const finish = async () => {
        const dirPath = await unzipFile(_path, fileID);
        fs.unlinkSync(_path);

        resolve({ dirPath });
      };

      writer.on("finish", finish);
      writer.on("error", (error) =>
        reject({ msg: "file process error", err: error })
      );
    });
  } catch (error) {
    fs.unlinkSync(_path);
    throw error;
  }
};

module.exports = fileHandler;
