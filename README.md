# URL Shortener

Sebuah aplikasi URL shortener sederhana yang dibangun menggunakan Node.js, Express, dan Prisma. Aplikasi ini menyediakan REST API untuk membuat dan mengelola URL pendek, serta antarmuka Command Line (CLI) untuk interaksi langsung.

---

## 🚀 Fitur

- **Membuat URL Pendek**: Menghasilkan kode pendek acak untuk URL panjang.
- **Kode Kustom**: Mendukung pembuatan URL pendek dengan kode pilihan pengguna.
- **URL Kedaluwarsa**: Mengatur waktu kedaluwarsa untuk setiap URL pendek.
- **Pengalihan Cepat**: Mengalihkan `short_url` ke `original_url` dengan efisien.
- **Penghitung Klik**: Melacak berapa kali sebuah URL diakses.
- **REST API**: Endpoint API untuk integrasi dengan aplikasi lain.
- **Antarmuka CLI**: Menu interaktif di terminal untuk mengelola URL tanpa perlu API client.

---

## 🛠️ Teknologi yang Digunakan

- **Backend**: Node.js, Express
- **Database ORM**: Prisma
- **Database**: MySQL (atau database lain yang didukung Prisma)
- **Antarmuka CLI**: Inquirer
- **Lainnya**: Dotenv (untuk environment variables), Moment.js (untuk manipulasi tanggal)

---

## ⚙️ Instalasi dan Konfigurasi

Ikuti langkah-langkah berikut untuk menjalankan proyek ini secara lokal.

### 1. Clone Repository

```bash
git clone [URL_REPOSITORY_ANDA]
cd url-short
```

### 2. Instal Dependensi

Pastikan Anda memiliki Node.js dan npm terinstal.

```bash
npm install
```

### 3. Konfigurasi Environment

Buat file `.env` di root direktori proyek dengan menyalin dari `.env.example` (jika ada) atau buat baru.

```
# .env

# URL koneksi ke database Anda
# Contoh untuk MySQL: mysql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="mysql://root:password@localhost:3306/url_shortener"

# Base URL untuk respons API dan CLI (termasuk port)
BASE_URL="http://localhost:5000"
```

### 4. Migrasi Database

Jalankan perintah berikut untuk membuat tabel di database sesuai dengan skema Prisma.

```bash
npx prisma migrate dev --name init
```

Perintah ini akan membuat tabel `urls` di database Anda.

### 5. Generate Prisma Client

Meskipun biasanya otomatis, pastikan Prisma Client Anda up-to-date.

```bash
npx prisma generate
```

---

## ▶️ Cara Menjalankan

Aplikasi ini memiliki dua mode eksekusi: **Server API** dan **Mode CLI**.

### 1. Menjalankan Server (API)

Perintah ini akan menjalankan server Express dengan mode `--watch`, yang akan me-restart server secara otomatis setiap kali ada perubahan pada file.

```bash
npm run server
```

Server akan berjalan di `http://localhost:5000` (atau port yang ditentukan).

**Endpoint API yang Tersedia:**

- `POST /api/urls` : Membuat URL pendek baru.
- `GET /:short_code` : Mengalihkan ke URL asli dan mencatat klik.
- `GET /api/urls` : Melihat semua URL yang tersimpan.

### 2. Menjalankan Mode CLI

Perintah ini akan membuka antarmuka interaktif di terminal Anda untuk mengelola URL.

```bash
npm run cli
```

Anda akan disajikan menu untuk membuat URL baru atau melihat daftar semua URL yang ada dalam format tabel.

---

## 📂 Struktur Proyek (Ringkas)

```
/
├── prisma/
│   └── schema.prisma      # Skema database Prisma
├── src/
│   ├── database.js        # Inisialisasi Prisma Client
│   └── url-controller.js  # Logika bisnis aplikasi
│   └── url-routes.js      # Rute API Express
├── .env                   # File environment (Jangan di-commit)
├── cli.js                 # Logika untuk antarmuka CLI
├── server.js              # Entry point untuk server Express
└── package.json           # Dependensi dan skrip proyek
```
