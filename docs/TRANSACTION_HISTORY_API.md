# Transaction History API

API endpoints untuk melihat riwayat transaksi penjualan (selling) dengan detail lengkap.

## Endpoints

### 1. Get Transaction List

Mendapatkan daftar transaksi dengan pagination dan filtering.

**Endpoint:** `GET /transaction/selling/list`

**Authentication:** Required (Bearer token)

**Permissions:** `selling` atau `purchase`

#### Query Parameters

| Parameter    | Type     | Required | Description                                          |
| ------------ | -------- | -------- | ---------------------------------------------------- |
| `page`       | integer  | No       | Halaman yang ingin ditampilkan (default: 1)          |
| `limit`      | integer  | No       | Jumlah data per halaman (default: 20)                |
| `start_date` | datetime | No       | Filter transaksi dari tanggal (format: YYYY-MM-DD)   |
| `end_date`   | datetime | No       | Filter transaksi sampai tanggal (format: YYYY-MM-DD) |
| `is_paid`    | enum     | No       | Status pembayaran (1=overview, 2=unpaid, 3=paid)     |
| `user_id`    | string   | No       | Filter berdasarkan kasir/user                        |
| `market_id`  | string   | No       | Filter berdasarkan toko/market                       |

#### Response

```json
{
	"data": [
		{
			"id": "abc123xyz",
			"payment_id": "xendit_payment_123",
			"total_price": 150000,
			"payed_money": 200000,
			"change_money": 50000,
			"is_paid": "3",
			"created_at": "2024-01-15T10:30:00.000Z",
			"user": {
				"id": "user123",
				"username": "kasir01",
				"email": "kasir01@example.com"
			},
			"market": {
				"id": "market01",
				"name": "Toko Pusat"
			},
			"payment": {
				"id": "pm01",
				"name": "QRIS"
			},
			"member": null,
			"voucher": null,
			"items": [
				{
					"id": "detail001",
					"qty": 2,
					"mod_price": 25000,
					"total_price": 50000,
					"stock": {
						"id": "stock001",
						"name": "Produk A"
					},
					"price": {
						"id": "price001",
						"price": 25000
					}
				}
			]
		}
	],
	"pagination": {
		"page": 1,
		"limit": 20,
		"total": 150,
		"totalPages": 8
	}
}
```

#### Example Requests

```bash
# Get first page (default 20 items)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/transaction/selling/list

# Get page 2 with 10 items per page
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/transaction/selling/list?page=2&limit=10"

# Filter by date range
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/transaction/selling/list?start_date=2024-01-01&end_date=2024-01-31"

# Filter paid transactions only
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/transaction/selling/list?is_paid=3"

# Filter by user and market
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/transaction/selling/list?user_id=user123&market_id=market01"

# Combine filters
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/transaction/selling/list?start_date=2024-01-01&is_paid=3&page=1&limit=50"
```

---

### 2. Get Transaction by ID

Mendapatkan detail transaksi spesifik berdasarkan ID.

**Endpoint:** `GET /transaction/selling/byid/:id`

**Authentication:** Required (Bearer token)

**Permissions:** `selling` atau `purchase`

#### Path Parameters

| Parameter | Type   | Required | Description  |
| --------- | ------ | -------- | ------------ |
| `id`      | string | Yes      | ID transaksi |

#### Response

```json
{
	"id": "abc123xyz",
	"payment_id": "xendit_payment_123",
	"total_weight_qty": 5.5,
	"totol_pcs_qty": 10,
	"price": 150000,
	"per_item_disc": 5000,
	"voucher_disc": 0,
	"total_disc": 5000,
	"tax_price": 0,
	"total_price": 145000,
	"payed_money": 150000,
	"change_money": 5000,
	"is_paid": "3",
	"online_order": "1",
	"note": "Catatan transaksi",
	"created_at": "2024-01-15T10:30:00.000Z",
	"updated_at": "2024-01-15T10:30:00.000Z",
	"user": {
		"id": "user123",
		"username": "kasir01",
		"email": "kasir01@example.com"
	},
	"market": {
		"id": "market01",
		"name": "Toko Pusat",
		"address": "Jl. Contoh No. 123"
	},
	"payment": {
		"id": "pm01",
		"name": "QRIS",
		"type": "digital"
	},
	"member": {
		"id": "member01",
		"name": "John Doe",
		"phone": "08123456789"
	},
	"voucher": null,
	"items": [
		{
			"id": "detail001",
			"qty": 2,
			"mod_price": 25000,
			"total_price": 50000,
			"note": "Catatan item",
			"stock": {
				"id": "stock001",
				"name": "Produk A",
				"qty": 100
			},
			"price": {
				"id": "price001",
				"price": 25000,
				"discount": 0
			}
		},
		{
			"id": "detail002",
			"qty": 1,
			"mod_price": 95000,
			"total_price": 95000,
			"note": null,
			"stock": {
				"id": "stock002",
				"name": "Produk B",
				"qty": 50
			},
			"price": {
				"id": "price002",
				"price": 100000,
				"discount": 5000
			}
		}
	]
}
```

#### Example Request

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/transaction/selling/byid/abc123xyz
```

#### Error Responses

**404 Not Found**

```json
{
	"message": "Transaction not found"
}
```

**401 Unauthorized**

```json
{
	"message": "Token not found"
}
```

**403 Forbidden**

```json
{
	"message": "Do not have permission for this operation.",
	"login": true
}
```

---

## Data Models

### Selling (Transaction)

| Field              | Type      | Description                                      |
| ------------------ | --------- | ------------------------------------------------ |
| `id`               | string    | ID transaksi (primary key)                       |
| `payment_id`       | string    | ID pembayaran eksternal (e.g., Xendit)           |
| `total_weight_qty` | double    | Total berat barang                               |
| `totol_pcs_qty`    | double    | Total jumlah pieces                              |
| `price`            | double    | Harga sebelum diskon                             |
| `per_item_disc`    | double    | Total diskon per item                            |
| `voucher_disc`     | double    | Diskon voucher                                   |
| `total_disc`       | double    | Total diskon                                     |
| `tax_price`        | double    | Pajak                                            |
| `total_price`      | double    | Total harga akhir                                |
| `payed_money`      | double    | Uang yang dibayarkan                             |
| `change_money`     | double    | Kembalian                                        |
| `is_paid`          | enum      | Status pembayaran (1=overview, 2=unpaid, 3=paid) |
| `online_order`     | enum      | Tipe order (1=offline, 2=online, 3=other)        |
| `note`             | text      | Catatan transaksi                                |
| `created_at`       | timestamp | Waktu pembuatan                                  |
| `updated_at`       | timestamp | Waktu update terakhir                            |

### SellingProductDetail (Transaction Item)

| Field         | Type     | Description             |
| ------------- | -------- | ----------------------- |
| `id`          | string   | ID detail (primary key) |
| `selling`     | relation | Relasi ke Selling       |
| `stock`       | relation | Relasi ke Stock         |
| `price`       | relation | Relasi ke Price         |
| `qty`         | double   | Jumlah barang           |
| `mod_price`   | double   | Harga yang digunakan    |
| `total_price` | double   | Total harga item        |
| `note`        | text     | Catatan item            |

---

## Use Cases

### 1. Kasir App - Transaction History

Aplikasi kasir menampilkan riwayat transaksi hari ini:

```bash
GET /transaction/selling/list?start_date=2024-01-15&end_date=2024-01-15&user_id=kasir01
```

### 2. Admin Dashboard - Sales Report

Dashboard admin melihat semua transaksi bulan ini yang sudah dibayar:

```bash
GET /transaction/selling/list?start_date=2024-01-01&end_date=2024-01-31&is_paid=3&limit=100
```

### 3. Receipt Printing

Aplikasi kasir mencetak struk untuk transaksi spesifik:

```bash
GET /transaction/selling/byid/abc123xyz
```

### 4. Store Manager - Store Performance

Manager toko melihat transaksi toko tertentu:

```bash
GET /transaction/selling/list?market_id=market01&start_date=2024-01-01
```

---

## Notes

- Semua endpoint memerlukan autentikasi dengan Bearer token
- Token didapatkan dari endpoint `/login`
- Pagination default: 20 items per page
- Data diurutkan berdasarkan `created_at` descending (terbaru di atas)
- Filter `start_date` dan `end_date` menggunakan format ISO 8601 atau YYYY-MM-DD
- Relasi `user`, `market`, `payment`, `member`, `voucher` sudah di-load otomatis (eager loading)
