const express = require("express");
const getPages = require("./getPages");
const getPage = require("./getPage");
const createPage = require("./createPage");
const deletePage = require("./deletePage");
const saveTempPage = require("./saveTempPage");

const router = express.Router();

// GET /pages
router.get("/", getPages);

// GET /page
router.get("/:page", getPage);

// POST /pages/create
router.post("/create", createPage);

// POST /pages/temp
router.post("/temp", saveTempPage);

// POST /pages/delete
router.post("/delete", deletePage);

module.exports = router;
