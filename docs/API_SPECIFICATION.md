# API Architecture & Endpoint Specification

Spesifikasi Endpoint RESTful API untuk **Aplikasi Pencatatan Keuangan Personal & Rumah Tangga Modern**.

---

## 1. Overview Base URL & Headers

- **Base URL:** `/api/v1`
- **Content-Type:** `application/json`
- **Authentication:** `Bearer <JWT_TOKEN>`

---

## 2. Endpoints Summary

### 2.1 Accounts & Balances (`/api/v1/accounts`)

#### `GET /api/v1/accounts`
Mengambil daftar ringkasan saldo pengguna (Saldo Utama, Sub-Saldo Rumah Tangga, Sub-Saldo Personal).

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "acc-101",
      "type": "PRIMARY",
      "name": "Saldo Utama (Bank BCA / Gaji)",
      "balance": 15000000.00,
      "updatedAt": "2026-09-04T08:00:00Z"
    },
    {
      "id": "acc-102",
      "type": "HOUSEHOLD_SUB",
      "name": "Sub-Saldo Rumah Tangga",
      "balance": 4500000.00,
      "updatedAt": "2026-09-04T08:00:00Z"
    },
    {
      "id": "acc-103",
      "type": "PERSONAL_SUB",
      "name": "Sub-Saldo Personal",
      "balance": 2200000.00,
      "updatedAt": "2026-09-04T08:00:00Z"
    }
  ]
}
```

---

### 2.2 Balance Allocation Transfer (`/api/v1/transfers`)

#### `POST /api/v1/transfers`
Melakukan pengalokasian dana dari **Saldo Utama** ke **Sub-Saldo Rumah Tangga** atau **Sub-Saldo Personal**.
*Catatan:* Transaksi ini mengurangi Saldo Utama dan menambah Sub-Saldo tanpa menghitungnya sebagai pengeluaran akhir.

**Request Body:**
```json
{
  "fromAccountId": "acc-101",
  "toAccountId": "acc-102",
  "amount": 3000000,
  "date": "2026-09-04",
  "notes": "Alokasi Belanja Bulanan & Tagihan September"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Dana berhasil dialokasikan",
  "data": {
    "transferId": "trf-501",
    "allocatedAmount": 3000000,
    "updatedPrimaryBalance": 12000000.00,
    "updatedTargetSubBalance": 7500000.00
  }
}
```

---

### 2.3 Transactions (`/api/v1/transactions`)

#### `POST /api/v1/transactions`
Mencatat transaksi baru (Pemasukan / Pengeluaran) dengan menentukan **Sumber Saldo (Deduction Source)**.

**Request Body (Pengeluaran Sub-Saldo Rumah Tangga):**
```json
{
  "type": "EXPENSE",
  "accountId": "acc-102",
  "categoryId": "cat-household-01",
  "amount": 450000,
  "date": "2026-09-04",
  "description": "Belanja bahan makanan bulanan di Supermarket"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Transaksi pengeluaran berhasil dicatat",
  "data": {
    "id": "trx-991",
    "type": "EXPENSE",
    "deductionSource": "HOUSEHOLD_SUB",
    "remainingAccountBalance": 4050000.00
  }
}
```

#### `GET /api/v1/transactions`
Mengambil riwayat transaksi lengkap dengan filter tanggal, sumber saldo, tipe, kategori, dan kata kunci pencarian.

**Query Parameters:**
- `startDate`: Format `YYYY-MM-DD`
- `endDate`: Format `YYYY-MM-DD`
- `accountId`: Filter UUID saldo
- `type`: `INCOME` | `EXPENSE` | `ALLOCATION`
- `categoryId`: Filter UUID kategori
- `search`: Kata kunci deskripsi
- `page`: Nomor halaman (default `1`)
- `limit`: Jumlah data per halaman (default `20`)

---

### 2.4 Categories Management (`/api/v1/categories`)

#### `GET /api/v1/categories`
Mengambil daftar seluruh kategori (Pemasukan, Pengeluaran Rumah Tangga, Pengeluaran Personal).

#### `POST /api/v1/categories`
Menambahkan kategori kustom baru.

**Request Body:**
```json
{
  "scope": "HOUSEHOLD_EXPENSE",
  "name": "Peliharaan & Perawatan Hewan",
  "icon": "heart",
  "color": "#10B981"
}
```

#### `PUT /api/v1/categories/:id` & `DELETE /api/v1/categories/:id`
Memperbarui atau menghapus kategori kustom.

---

### 2.5 Reports & Dashboard Data (`/api/v1/reports`)

#### `GET /api/v1/reports/summary`
Mengambil data ringkasan laporan high-level (Net Cash Flow, Total Income, Total Expense, Budget vs Realization).

#### `GET /api/v1/reports/export`
Mengekspor data transaksi ke format CSV / PDF.
