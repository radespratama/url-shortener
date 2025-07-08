require("dotenv").config();

const express = require("express");

const UrlController = require("./src/modules/Url/controllers/url-controller");
const urlRoutes = require("./src/modules/Url/routes/url-routes");

const app = express();

const urlController = new UrlController();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/:short_code", urlController.redirectToOriginalUrl);
app.use("/api/urls", urlRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
