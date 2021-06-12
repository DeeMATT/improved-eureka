const express = require("express");
const router = express.Router();

const buildTemplate = require("./compiler");
const zipHandler = require("./fileHandler");
const { zipDir } = require("./zipHelper");

router.post("/generate-template", async (req, res, next) => {
  const { fileUrl, data } = req.body;
  try {
    const file = await zipHandler(fileUrl);
    const templateFile = `${file.dirPath}/index.html`;

    // overwites the initial template index.html
    buildTemplate(templateFile, data);

    const templateZip = zipDir(file.dirPath);
    //Upload to main service
    //unlink file
  } catch (error) {
    next(error);
  }
});

module.exports = router;
