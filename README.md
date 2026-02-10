<div align="center">

# Lofish Market API

**Backend RESTful API untuk sistem manajemen pasar ikan**
_Point of Sale · Inventaris · Transaksi · Manajemen Pengguna_

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8+-4479A1?logo=mysql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-0.3-FE0803?logo=typeorm&logoColor=white)
![License](https://img.shields.io/badge/License-Private-red)

</div>

---

## Daftar Isi

- [Tentang Project](#tentang-project)
- [Tech Stack](#tech-stack)
- [Struktur Project](#struktur-project)
- [Instalasi](#instalasi)
- [Environment Variables](#environment-variables)
- [Menjalankan Server](#menjalankan-server)
- [Database & Migrasi](#database--migrasi)
- [API Endpoints](#api-endpoints)
- [Middleware](#middleware)

---

## Tentang Project

**Lofish Market** adalah backend API untuk aplikasi kasir dan manajemen pasar ikan. Sistem ini menangani:

- **Autentikasi & Otorisasi** — Login/Logout dengan JWT, role & permission management
- **Manajemen Pengguna** — User, Roles, Permissions, Members, Sessions, Suppliers
- **Manajemen Produk** — Products, Categories, Grades, Sizes, Stock, Pricing, Stock Opname
- **Transaksi** — Selling, Purchasing, Cart, Vouchers, Payment Methods
- **Fitur Pendukung** — Profil toko, konfigurasi, notifikasi, data sync (import/export), cash drawer, weight scale
- **Integrasi Xendit** — Webhook untuk pembayaran digital (QRIS, dll.)

---

## Tech Stack

| Teknologi      | Keterangan                    |
| -------------- | ----------------------------- |
| **Node.js**    | Runtime environment           |
| **Express.js** | Web framework                 |
| **TypeORM**    | ORM untuk database            |
| **MySQL**      | Database relasional           |
| **JWT**        | Autentikasi token             |
| **Bcrypt**     | Hashing password              |
| **Multer**     | Upload file                   |
| **Morgan**     | HTTP request logger           |
| **Pug**        | Template engine (error pages) |
| **Nodemon**    | Auto-restart saat development |

---

## Struktur Project

```
lofish-market/
├── bin/
│   └── www                  # Entry point server (HTTP)
├── config/
│   ├── data-source.js       # Konfigurasi koneksi TypeORM
│   └── typeorm-cli.js       # Konfigurasi CLI TypeORM
├── controllers/
│   ├── authController.js    # Login, Logout
│   ├── userController.js    # Users, Members, Roles, Permissions, Suppliers
│   ├── productController.js # Products, Stock, Pricing, Categories, dll.
│   ├── featureController.js # Profile, Config, Notifications, Data Sync
│   └── transactionController.js # Selling, Purchasing, Vouchers, dll.
├── db/
│   ├── entities/            # 35 entity TypeORM (tabel database)
│   ├── migrations/          # 15 file migrasi database
│   └── seeder/              # Data seeder
├── middleware/
│   ├── auth.js              # JWT authentication & authorization
│   ├── dataChange.js        # Logging perubahan data
│   ├── errorHandler.js      # Global error handler
│   ├── generateId.js        # Generator ID unik
│   └── uploadFile.js        # Konfigurasi Multer untuk upload
├── routes/
│   ├── index.js             # Route utama (semua endpoint)
│   ├── user.js              # Route user (dengan auth middleware)
│   ├── product.js           # Route product (dengan auth middleware)
│   ├── feature.js           # Route feature (dengan auth middleware)
│   └── transaction.js       # Route transaction (dengan auth middleware)
├── public/                  # Static files
├── upload/                  # Direktori upload file
├── views/                   # Template Pug (error pages)
├── app.js                   # Express app setup
├── package.json
└── .env                     # Environment variables
```

---

## Instalasi

### Prasyarat

- **Node.js** v18+
- **MySQL** v8+
- **npm** atau **yarn**

### Langkah-langkah

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd lofish-market
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Buat database MySQL**

   ```sql
   CREATE DATABASE lofish_market;
   ```

4. **Konfigurasi environment** — salin dan sesuaikan file `.env` (lihat bagian [Environment Variables](#environment-variables))

5. **Jalankan migrasi database**

   ```bash
   npm run migration
   ```

6. **Jalankan server**

   ```bash
   npm start
   ```

---

## Environment Variables

Buat file `.env` di root project dengan konfigurasi berikut:

```env
## SERVER
BACKEND_PORT=3000

## DATABASE
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=lofish_market
DB_SYNC=true           # Auto-sync schema (development only!)
DB_LOGG=false          # TypeORM query logging

## JWT
JWT_SECRET=your_secret_key

## ENVIRONMENT
PROD=false
DEV=true

## CLIENT URLs (CORS)
DEV_ADMIN_URL=http://localhost:5173
PROD_ADMIN_URL=https://your-admin-domain.com
DEV_CLIENT_URL=http://localhost:5174
PROD_CLIENT_URL=https://your-client-domain.com

## XENDIT
XENDIT_WEBHOOK_TOKEN=your_xendit_webhook_token
```

> **Penting:** Jangan gunakan `DB_SYNC=true` di production! Gunakan migrasi database.

---

## Menjalankan Server

```bash
# Development (auto-restart dengan Nodemon)
npm start

# Server berjalan di http://localhost:3000
```

Port default adalah `3000`, bisa diubah melalui environment variable `BACKEND_PORT`.

---

## Database & Migrasi

Project ini menggunakan **TypeORM** dengan **35 entities** yang mencakup seluruh model data.

### Perintah Migrasi

```bash
# Jalankan semua migrasi
npm run migration

# Generate migrasi baru dari perubahan entity
npm run migration:generate -- db/migrations/NamaMigrasi

# Buat file migrasi kosong
npm run migration:create -- db/migrations/NamaMigrasi

# Revert migrasi terakhir
npm run migration:revert
```

### Daftar Entity

| Modul         | Entities                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **User**      | User, Role, Permission, HasPermit, Member, Session, Profile, Supplier                                                    |
| **Product**   | Product, Category, Grade, Size, Price, Stock, StockOpname, StockOpnameDetail, Service, Reject                            |
| **Transaksi** | Selling, SellingProductDetail, SellingServiceDetail, Purchase, CartItem, CashDrawer, PaymentMethod, Voucher, WeightScale |
| **Fitur**     | Config, CatApp, Notification, DataChange, DataReceive, SyncExport, SyncImport, Failed_job                                |

---

## API Endpoints

Server berjalan di `http://localhost:3000`. Berikut ringkasan endpoint yang tersedia:

### Dokumentasi API

| Method | Endpoint    | Deskripsi                                           |
| ------ | ----------- | --------------------------------------------------- |
| GET    | `/api-docs` | Halaman dokumentasi interaktif (Swagger UI / Redoc) |

### Autentikasi

| Method | Endpoint  | Deskripsi   |
| ------ | --------- | ----------- |
| POST   | `/login`  | Login user  |
| POST   | `/logout` | Logout user |

### User Management

| Method | Endpoint                | Deskripsi          |
| ------ | ----------------------- | ------------------ |
| GET    | `/user-list`            | Daftar semua user  |
| POST   | `/user-create`          | Buat user baru     |
| PATCH  | `/user-update/:id`      | Update user        |
| GET    | `/user-soft-delete/:id` | Soft delete user   |
| GET    | `/member-list`          | Daftar member      |
| POST   | `/member-create`        | Buat member baru   |
| GET    | `/role-list`            | Daftar role        |
| POST   | `/role-create`          | Buat role baru     |
| GET    | `/permission-list`      | Daftar permission  |
| GET    | `/supplier-list`        | Daftar supplier    |
| POST   | `/supplier-create`      | Buat supplier baru |

### Product Management

| Method | Endpoint              | Deskripsi           |
| ------ | --------------------- | ------------------- |
| GET    | `/product-list`       | Daftar produk       |
| POST   | `/product-create`     | Buat produk baru    |
| PATCH  | `/product-update/:id` | Update produk       |
| GET    | `/stock-list`         | Daftar stok         |
| POST   | `/stock-create`       | Tambah stok         |
| GET    | `/price-list`         | Daftar harga        |
| GET    | `/category-list`      | Daftar kategori     |
| GET    | `/grade-list`         | Daftar grade        |
| GET    | `/size-list`          | Daftar ukuran       |
| GET    | `/stock-opname-list`  | Daftar stock opname |
| GET    | `/service-list`       | Daftar layanan/jasa |

### Transaksi

| Method | Endpoint               | Deskripsi                |
| ------ | ---------------------- | ------------------------ |
| GET    | `/selling-list`        | Daftar penjualan         |
| POST   | `/selling-create`      | Buat transaksi penjualan |
| GET    | `/purchase-list`       | Daftar pembelian         |
| POST   | `/purchase-create`     | Buat transaksi pembelian |
| GET    | `/chart-item-list`     | Daftar item keranjang    |
| POST   | `/chart-item-create`   | Tambah item ke keranjang |
| GET    | `/voucher-list`        | Daftar voucher           |
| GET    | `/payment-method-list` | Daftar metode pembayaran |
| GET    | `/cash-drawer-list`    | Daftar cash drawer       |
| GET    | `/weight-scale-list`   | Daftar timbangan         |

### Fitur & Konfigurasi

| Method | Endpoint             | Deskripsi                |
| ------ | -------------------- | ------------------------ |
| GET    | `/profile-list`      | Daftar profil toko       |
| GET    | `/config-list`       | Daftar konfigurasi       |
| GET    | `/notification-list` | Daftar notifikasi        |
| GET    | `/cat-app-list`      | Daftar kategori aplikasi |
| GET    | `/data-change-list`  | Log perubahan data       |
| GET    | `/export-list`       | Daftar data export       |
| GET    | `/import-list`       | Daftar data import       |

> Setiap resource umumnya memiliki endpoint CRUD lengkap: `*-list` (GET), `*-create` (POST), `*-update/:id` (PATCH), `*-delete/:id` (GET).

---

## Middleware

| Middleware         | File                         | Deskripsi                                        |
| ------------------ | ---------------------------- | ------------------------------------------------ |
| **Authentication** | `middleware/auth.js`         | Verifikasi JWT token & otorisasi role/permission |
| **Error Handler**  | `middleware/errorHandler.js` | Global error handling & response formatting      |
| **Data Change**    | `middleware/dataChange.js`   | Logging perubahan data untuk audit trail         |
| **Upload File**    | `middleware/uploadFile.js`   | Konfigurasi Multer untuk upload gambar/file      |
| **Generate ID**    | `middleware/generateId.js`   | Generator ID unik untuk record baru              |

---

## Lisensi

Private — Hak cipta dilindungi.
