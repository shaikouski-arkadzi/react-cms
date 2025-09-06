const fs = require("fs");
const { dir } = require("../../config");

module.exports = async (req, res) => {
  try {
    const files = await fs.promises.readdir(dir);
    const response = files.filter((file) => file.endsWith(".html"));
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error reading directory" });
  }
};
