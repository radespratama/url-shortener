const express = require("express");
const UrlController = require("../controllers/url-controller");

const router = express.Router();

const urlController = new UrlController();

router.post("/", urlController.createShortUrl);
router.get("/", urlController.getUrls);

module.exports = router;
