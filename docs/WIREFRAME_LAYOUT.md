# UI Layout & Wireframe Specifications

Dokumentasi tata letak dan struktur komponen UI untuk **Aplikasi Pencatatan Keuangan Personal & Rumah Tangga Modern**.

---

## 1. Top Navigation Bar (Header)

```
[ Icon/Logo: FinanceCraft ]  [ Dashboard ]  [ Laporan Detail ]  [ Kelola Kategori ]       [ Theme Toggle 🌙/☀️ ]
---------------------------------------------------------------------------------------------------------------
Quick Summary Ticker:  Saldo Utama: Rp 15.000.000  |  Sub Rumah Tangga: Rp 4.500.000  |  Sub Personal: Rp 2.200.000
```

---

## 2. Dashboard Wireframe Layout

```
+-------------------------------------------------------------------------------------------------------------+
|  SUMMARY CARDS (5-Column Responsive Grid)                                                                   |
|  +--------------------+ +--------------------+ +--------------------+ +------------------+ +--------------+ |
|  | Saldo Utama        | | Sub Rumah Tangga   | | Sub Personal       | | Total Pemasukan  | | Total        | |
|  | Rp 15.000.000     | | Rp 4.500.000      | | Rp 2.200.000      | | Bulan Ini        | | Pengeluaran  | |
|  | [ Utama / Gaji ]   | | [ Pos Alokasi RT ] | | [ Pos Personal ]   | | Rp 18.500.000   | | Rp 6.700.000 | |
|  +--------------------+ +--------------------+ +--------------------+ +------------------+ +--------------+ |
+-------------------------------------------------------------------------------------------------------------+
|  QUICK ACTION BAR                                                                                           |
|  [ + Tambah Transaksi ]   [ ⇄ Alokasi Sub-Saldo ]   [ 🏷️ Kelola Kategori ]   [ 📊 Lihat Laporan Lengkap ]     |
+-------------------------------------------------------------------------------------------------------------+
|  VISUAL CHARTS (Interactive Dashboard Analytics Grid)                                                      |
|  +-----------------------------------------------+ +------------------------------------------------------+ |
|  | Tren Pemasukan vs Pengeluaran (Line Chart)    | | Distribusi Pengeluaran per Kategori (Donut Chart)   | |
|  | [ Jan ] [ Feb ] [ Mar ] [ Apr ] [ Mei ] [ Jun]| | - Belanja Bulanan (40%)                            | |
|  | ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   | | - Tagihan/Utilitas (25%)                           | |
|  |                                               | | - Hiburan & Jajan (20%)                            | |
|  +-----------------------------------------------+ +------------------------------------------------------+ |
|  +--------------------------------------------------------------------------------------------------------+ |
|  | Perbandingan Pengeluaran per Sumber Saldo (Bar Chart: Utama vs Sub RT vs Sub Personal)                | |
|  +--------------------------------------------------------------------------------------------------------+ |
+-------------------------------------------------------------------------------------------------------------+
|  RECENT TRANSACTIONS WIDGET (Tabel 5 - 10 Transaksi Terakhir)                                               |
|  +------------+--------------------+---------------+---------------+---------------+----------------------+ |
|  | Tanggal    | Keterangan         | Sumber Saldo  | Kategori      | Tipe          | Nominal              | |
|  +------------+--------------------+---------------+---------------+---------------+----------------------+ |
|  | 04/09/2026 | Gaji Bulanan       | Saldo Utama   | Gaji          | [Pemasukan]   | + Rp 20.000.000 (I)  | |
|  | 04/09/2026 | Alokasi Sub RT     | Utama -> RT   | Transfer      | [Alokasi]     | ⇄ Rp 5.000.000  (A)  | |
|  | 04/09/2026 | Belanja Supermkt   | Sub RT        | Belanja RT    | [Pengeluaran] | - Rp 450.000    (E)  | |
|  +------------+--------------------+---------------+---------------+---------------+----------------------+ |
+-------------------------------------------------------------------------------------------------------------+
```

---

## 3. Detailed Reports Layout

```
+-------------------------------------------------------------------------------------------------------------+
|  LAPORAN DETAIL & ANALISIS FINANSIAL                                                                        |
+-------------------------------------------------------------------------------------------------------------+
|  FILTER & SEARCH BAR                                                                                        |
|  [ Rentang Tanggal: 01/09/2026 - 30/09/2026 ] [ Sumber Saldo: Semua ] [ Tipe: Semua ] [ Cari: "Belanja" ]     |
|  [ Tombol Ekspor CSV 📥 ] [ Tombol Cetak PDF 🖨️ ]                                                           |
+-------------------------------------------------------------------------------------------------------------+
|  HIGH-LEVEL CASHFLOW SUMMARY METRICS                                                                        |
|  Net Cash Flow: + Rp 11.800.000  | Total Alokasi RT: Rp 5.000.000 | Total Alokasi Personal: Rp 2.500.000      |
+-------------------------------------------------------------------------------------------------------------+
|  TABEL HISTORY TRANSAKSI LENGKAP WITH PAGINATION                                                            |
+-------------------------------------------------------------------------------------------------------------+
```
