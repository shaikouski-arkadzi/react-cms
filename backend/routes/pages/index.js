const express = require("express");
const getPages = require("./getPages");
const createPage = require("./createPage");
const deletePage = require("./deletePage");

const router = express.Router();

// GET /pages
router.get("/", getPages);

// POST /pages/create
router.post("/create", createPage);

// POST /pages/delete
router.post("/delete", deletePage);

module.exports = router;
