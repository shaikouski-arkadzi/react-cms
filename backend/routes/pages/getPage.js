const fs = require("fs");
const path = require("path");
const { dir } = require("../../config");

module.exports = async (req, res) => {
  try {
    const { page } = req.params;
    if (!page) {
      return res.status(400).json({ error: "Page name is required" });
    }

    const filePath = path.join(dir, page);

    if (!filePath.endsWith(".html")) {
      return res.status(400).json({ error: "Only .html files allowed" });
    }

    const content = await fs.promises.readFile(filePath, "utf8");

    res.json({ page, content });
  } catch (error) {
    res.status(500).json({ error: "Error reading file" });
  }
};
