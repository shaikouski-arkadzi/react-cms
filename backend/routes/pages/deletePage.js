const fs = require("fs");
const path = require("path");
const { dir } = require("../../config");

module.exports = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send("Bad Request: no file name");
  }

  const file = path.join(dir, name);

  if (fs.existsSync(file)) {
    await fs.promises.unlink(file);
    res.send("File deleted");
  } else {
    res.status(400).send("Bad Request: file not found");
  }
};
