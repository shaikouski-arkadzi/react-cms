const fs = require("fs");
const path = require("path");
const { dir } = require("../../config");

module.exports = async (req, res) => {
  const { pageName, html } = req.body;

  if (!pageName || !html) {
    return res.status(400).send("Bad Request: missing pageName or html");
  }

  const file = path.join(dir, pageName);

  try {
    await fs.promises.writeFile(file, html);
    res.send("File saved");
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).send("Internal Server Error");
  }
};
