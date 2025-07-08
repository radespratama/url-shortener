const moment = require("moment");

const Utils = require("../../../utils");
const { dbPrisma } = require("../../../config/database");

class UrlController {
  constructor() {
    this.baseUrl = process.env.BASE_URL || "http://localhost:5000";
    this.utils = new Utils();

    this.createShortUrl = this.createShortUrl.bind(this);
    this.redirectToOriginalUrl = this.redirectToOriginalUrl.bind(this);
    this.getUrls = this.getUrls.bind(this);
  }

  async _getAllUrls() {
    return dbPrisma.url.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async _createUrl({ originalUrl, customCode, expiresInHours }) {
    let expiresAt = null;

    if (expiresInHours && !isNaN(expiresInHours)) {
      expiresAt = moment().add(expiresInHours, "hours").toISOString();
    }

    let shortCode = customCode;
    let isCustom = !!customCode;

    if (isCustom) {
      const existingUrl = await dbPrisma.url.findUnique({
        where: { short_code: shortCode },
      });

      if (existingUrl) {
        throw new Error("Custom code already in use.");
      }
    } else {
      shortCode = this.utils.generateRandomString(8);
    }

    return dbPrisma.url.create({
      data: {
        original_url: originalUrl,
        short_code: shortCode,
        is_custom: isCustom,
        expires_at: expiresAt,
      },
    });
  }

  async getUrls(req, res) {
    try {
      const urls = await this._getAllUrls();

      if (!urls || urls.length < 1) {
        return res.status(404).json({ message: "No urls found", data: [] });
      }

      res.status(200).json({ message: "Urls found", data: urls });
    } catch (error) {
      console.error("GET URLS ERROR: ", error);
      return res
        .status(500)
        .json({ message: "GET URLS: Internal Server Error" });
    }
  }

  async redirectToOriginalUrl(req, res) {
    try {
      const { short_code: shortCode } = req.params;

      const urlData = await dbPrisma.url.findUnique({
        where: { short_code: shortCode },
      });

      if (!urlData || !urlData.is_active) {
        return res
          .status(404)
          .json({ message: "URL not found or is inactive." });
      }

      if (urlData.expires_at && moment().isAfter(urlData.expires_at)) {
        await dbPrisma.url.update({
          where: { id: urlData.id },
          data: { is_active: false },
        });

        return res.status(410).json({ message: "URL has expired." });
      }

      await dbPrisma.url
        .update({
          where: { id: urlData.id },
          data: { click_count: { increment: 1 } },
        })
        .catch((err) => console.error("UPDATE CLICK COUNT FAILED: ", err));

      return res.redirect(302, urlData.original_url);
    } catch (error) {
      console.error("REDIRECT URL ERROR: ", error);
      return res
        .status(500)
        .json({ message: "REDIRECT URL: Internal Server Error" });
    }
  }

  async createShortUrl(req, res) {
    try {
      const {
        original_url: originalUrl,
        custom_code: customCode,
        expires_in_hours: expiresInHours,
      } = req.body;

      const newUrl = await this._createUrl({
        originalUrl,
        customCode,
        expiresInHours,
      });

      return res.status(201).json({
        message: "URL shortened successfully",
        data: {
          original_url: newUrl.original_url,
          short_url: `${this.baseUrl}/${newUrl.short_code}`,
          expires_at: newUrl.expires_at,
        },
      });
    } catch (error) {
      console.error("CREATE URL ERROR: ", error);
      if (
        error.code === "P2002" &&
        error.meta?.target?.includes("short_code")
      ) {
        return res
          .status(409)
          .json({ message: "This short code is already taken." });
      }

      return res
        .status(500)
        .json({ message: "CREATE URL: Internal Server Error" });
    }
  }
}

module.exports = UrlController;
