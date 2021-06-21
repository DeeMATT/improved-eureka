const ejs = require("ejs");

const buildTemplate = (templateString, data) => {
  try {
    const template = ejs.compile(templateString);
    const html = template(data);

    return html;
  } catch (error) {
    throw error;
  }
};

module.exports = buildTemplate;
