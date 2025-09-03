const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

const dir = path.resolve(__dirname, "../site/");

app.get("/pages", async (req, res) => {
  try {
    const files = await fs.promises.readdir(dir);
    const response = files.filter((file) => file.endsWith(".html"));
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error reading directory" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
