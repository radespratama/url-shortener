const moment = require("moment");
const inquirer = require("inquirer");
const UrlController = require("./src/modules/Url/controllers/url-controller");

const urlController = new UrlController();

async function handleListUrls() {
  console.log("🔍 Mengambil daftar URL...");
  try {
    const urls = await urlController._getAllUrls();

    if (urls.length === 0) {
      console.log("🤔 Tidak ada URL yang ditemukan.");
      return;
    }

    const formattedUrls = urls.map((url) => ({
      "Original URL":
        url.original_url.length > 40
          ? url.original_url.substring(0, 37) + "..."
          : url.original_url,
      "Short URL": `${urlController.baseUrl}/${url.short_code}`,
      Clicks: url.click_count,
      "Expires At": url.expires_at
        ? moment(url.expires_at).format("YYYY-MM-DD HH:mm")
        : "Never",
    }));

    console.table(formattedUrls);
  } catch (error) {
    console.error("❌ Gagal mengambil URL:", error.message);
  }
}

async function handleCreateUrl() {
  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "originalUrl",
        message: "🔗 Masukkan URL asli:",
        validate: (input) => (input ? true : "URL tidak boleh kosong!"),
      },
      {
        type: "input",
        name: "customCode",
        message:
          "✍️ Masukkan kode kustom (opsional, tekan Enter untuk lewati):",
      },
      {
        type: "input",
        name: "expiresInHours",
        message:
          "⏰ Masukkan waktu kedaluwarsa dalam jam (opsional, tekan Enter untuk lewati):",
        validate: (input) => {
          if (input === "") return true;
          return !isNaN(parseFloat(input)) && isFinite(input)
            ? true
            : "Harap masukkan angka yang valid.";
        },
      },
    ]);

    console.log("⏳ Membuat URL pendek...");

    const newUrl = await urlController._createUrl({
      originalUrl: answers.originalUrl,
      customCode: answers.customCode || null,
      expiresInHours: answers.expiresInHours || null,
    });

    console.log("\n\x1b[32m\x1b[1m✅ URL berhasil dibuat!\x1b[0m");
    console.log(`   Original: ${newUrl.original_url}`);
    console.log(
      `   Short URL: \x1b[36m${urlController.baseUrl}/${newUrl.short_code}\x1b[0m`
    );
  } catch (error) {
    console.error(
      `\n\x1b[31m\x1b[1m❌ Gagal membuat URL: ${error.message}\x1b[0m`
    );
  }
}

async function runCli() {
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "\n🚀 Apa yang ingin Anda lakukan?",
        choices: [
          { name: "Buat URL Pendek Baru", value: "create" },
          { name: "Lihat Semua URL", value: "list" },
          new inquirer.Separator(),
          { name: "Keluar", value: "exit" },
        ],
      },
    ]);

    switch (action) {
      case "create":
        await handleCreateUrl();
        break;
      case "list":
        await handleListUrls();
        break;
      case "exit":
        console.log("👋 Selamat tinggal!");
        process.exit(0);
    }
  }
}

console.log(
  "\x1b[1m\x1b[34m--- Selamat Datang di URL Shortener CLI ---\x1b[0m"
);
runCli();
