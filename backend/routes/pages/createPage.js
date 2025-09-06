const fs = require("fs");
const path = require("path");

const { dir } = require("../../config");

module.exports = async (req, res) => {
  try {
    const { name } = req.body;
    const filePath = path.join(dir, `${name}.html`);

    if (fs.existsSync(filePath)) {
      return res.status(400).send("File already exists");
    }

    await fs.promises.writeFile(filePath, "");
    res.send("File created");
  } catch (error) {
    res.status(500).send("Server error");
  }
};
