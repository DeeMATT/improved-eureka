const ejs = require("ejs");
const fs = require("fs");

const buildTemplate = (templateFile, data) => {
  try {
    const templateString = fs.readFileSync(templateFile).toString();

    const template = ejs.compile(templateString);
    const html = template(data);

    fs.writeFileSync(templateFile, html);
  } catch (error) {
    throw error;
  }
};

module.exports = buildTemplate;
