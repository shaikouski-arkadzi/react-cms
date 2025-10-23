const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { dir } = require("../../config");

const upload = multer({ dest: path.join(dir, "uploads/") });

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("Bad Request: no image uploaded");
    }

    const fileExt = req.file.mimetype.split("/")[1];
    const fileName = `${Date.now().toString(36)}.${fileExt}`;
    const imgDir = path.join(dir, "img");

    if (!fs.existsSync(imgDir)) {
      await fs.promises.mkdir(imgDir, { recursive: true });
    }

    const newPath = path.join(imgDir, fileName);

    await fs.promises.rename(req.file.path, newPath);

    res.json({ src: fileName });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  uploadImage,
  uploadMiddleware: upload.single("image"),
};
