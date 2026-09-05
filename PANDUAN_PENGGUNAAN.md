# PANDUAN PENGGUNAAN APLIKASI FINANCECRAFT
## Financial Tracker Multi-Saldo Personal & Rumah Tangga Modern

---

## 1. Konsep Dasar Multi-Saldo

Aplikasi **FinanceCraft** menggunakan sistem pengelolaan **3 Jenis Saldo** untuk mencegah tercampurnya uang operasional rumah tangga dan dana pribadi:

1. **Saldo Utama (Primary Account):**
   - Berfungsi sebagai penampung awal seluruh **Pemasukan (Gaji, Bonus, Investasi)**.
2. **Sub-Saldo Rumah Tangga (Household Sub-Account):**
   - Pos anggaran khusus untuk keperluan **Operasional Rumah Tangga** (Belanja supermarket, tagihan PLN/PDAM, sekolah anak, dll).
3. **Sub-Saldo Personal (Personal Sub-Account):**
   - Pos anggaran khusus untuk keperluan **Pribadi & Lifestyle** (Hiburan, hobi, jajan/kopi, pakaian, dll).

---

## 2. Alur Penggunaan Harian (Step-by-Step)

### 📌 LANGKAH 1: Pencatatan Gaji / Pemasukan
1. Klik tombol **`+ Tambah Pemasukan`**.
2. Pada kolom **Saldo Tujuan**, pilih **`Saldo Utama`**.
3. Masukkan nominal gaji (contoh: `Rp 20.000.000`), pilih kategori `Gaji Bulanan`, dan simpan.

---

### 📌 LANGKAH 2: Pembagian Jatah Saldo (Alokasi Sub-Saldo)
> **Penting:** Pembagian jatah saldo **TIDAK DIHITUNG SEBAGAI PENGELUARAN (UANG HILANG)**, melainkan pemindahan pos anggaran.

1. Klik tombol **`⇄ Alokasi Sub-Saldo`**.
2. Pilih **Sub-Saldo Tujuan** (misal: `Sub Rumah Tangga`).
3. Masukkan nominal alokasi (misal: `Rp 5.000.000`) dan klik **Proses Alokasi Dana**.
4. **Hasilnya:** Saldo Utama berkurang Rp 5.000.000 dan Sub-Saldo Rumah Tangga bertambah Rp 5.000.000.

---

### 📌 LANGKAH 3: Pencatatan Belanja / Pengeluaran
1. Saat belanja atau bayar tagihan, klik tombol **`+ Tambah Pengeluaran`**.
2. Pada kolom **Sumber Saldo (Deduction Source)**:
   - Pilih **`Sub Rumah Tangga`** jika belanja kebutuhan rumah tangga.
   - Pilih **`Sub Personal`** jika membeli barang pribadi/jajan.
3. Masukkan nominal belanja dan simpan. Saldo pada pos yang dipilih akan berkurang secara otomatis.

---

## 3. Fitur Laporan & Analytics

- **Dashboard Visual:** Grafik Tren Pemasukan vs Pengeluaran, Donut Chart Kategori, dan Bar Chart Sumber Saldo.
- **High-Level Summary:** Melihat Net Cash Flow dan tingkat realisasi pengeluaran vs anggaran alokasi sub-saldo.
- **Detailed Report:** Filter transaksi berdasarkan rentang tanggal, sumber saldo, tipe, kategori, serta pencarian kata kunci.
- **Ekspor Data:** Klik **Ekspor CSV** atau **Cetak / Simpan PDF** untuk mengunduh laporan fisik.

---

## 4. Panduan Penggunaan MySQL Portabel (XAMPP / MariaDB Portable)

Apakah aplikasi ini bisa menggunakan **MySQL Portabel**? **SANGAT BISA!**

### Langkah Menjalankan MySQL Portabel:
1. Unduh atau ekstrak **XAMPP Portable** atau **MariaDB Portable** ke folder USB/Drive komputer Anda.
2. Jalankan `xampp-control.exe` dan klik tombol **Start** pada modul **MySQL** (Port `3306`).
3. Buka browser ke `http://localhost/phpmyadmin` dan buat database baru bernama `financecraft_db`.
4. Import file skema database SQL yang telah disediakan pada lokasi:
   [`server/schema.sql`](file:///d:/PRIVATE/Aplikasi%20Keuangan/server/schema.sql)
5. Jalankan backend server Node.js bawaan aplikasi:
   ```bash
   node server/server.js
   ```
6. Aplikasi akan terhubung langsung ke MySQL Portabel secara real-time.
