### Teks Prompt Markdown (.md)

Di bawah ini adalah isi prompt lengkap yang sudah disesuaikan dengan logika *multi-saldo* (Saldo Utama, Sub-Saldo Rumah Tangga, dan Sub-Saldo Personal), alokasi dana, dashboard modern, serta laporan detail. Anda bisa menyalin (*copy*) teks di dalam kotak di bawah ini langsung ke AI (ChatGPT, Claude, Gemini, dll.):

```markdown
# SYSTEM PROMPT / DEVELOPER SPECIFICATION

## 1. Peran & Tujuan (Role & Goal)
Bertindaklah sebagai **Full-Stack Web Developer & UI/UX Designer Senior**. Tugas Anda adalah merancang dan membangun **Aplikasi Web Pencatatan Keuangan Personal & Rumah Tangga Modern** dengan sistem pengelolaan multi-saldo (saldo utama & sub-saldo) serta laporan keuangan komprehensif.

---

## 2. Fitur Utama & Logika Bisnis (Core Features & Business Logic)

### A. Manajemen Saldo & Sistem Sub-Saldo (Multi-Account Rules)
1. **Saldo Utama (Primary Balance):** Sumber dana induk (contoh: Rekening Bank Utama / Gaji).
2. **Sub-Saldo (Sub-Accounts):**
   - **Sub-Saldo Rumah Tangga (Household Sub-Account)**
   - **Sub-Saldo Personal (Personal Sub-Account)**
3. **Mekanisme Transfer / Alokasi Saldo:**
   - Fitur "Pengambilan / Alokasi Dana" dari **Saldo Utama** ke **Sub-Saldo (Rumah Tangga / Personal)**.
   - Transaksi alokasi ini **memotong Saldo Utama** dan **menambah saldo Sub-Account** yang dipilih tanpa menghitungnya sebagai "Pengeluaran Akhir" (Internal Transfer / Pos Alokasi).
4. **Mekanisme Pengeluaran (Expense Deduction Logic):**
   - Setiap pencatatan pengeluaran wajib memilih **Sumber Saldo (Deduction Source)**:
     - `Mengurangi Saldo Utama`
     - `Mengurangi Sub-Saldo Rumah Tangga`
     - `Mengurangi Sub-Saldo Personal`
   - Saldo yang dipilih akan berkurang secara otomatis sesuai nominal pengeluaran.

---

### B. Kategori Transaksi (Transaction Categories)
Setiap transaksi (Pemasukan / Pengeluaran / Transfer) wajib dikelompokkan berdasarkan kategori:
- **Pemasukan:** Gaji, Bonus, Investasi, Usaha Sampingan, dll.
- **Pengeluaran Rumah Tangga:** Belanja Bulanan, Tagihan Listrik/Air, Pendidikan, Kesehatan, dll.
- **Pengeluaran Personal:** Hiburan, Hobi, Pakaian, Jajan/Makan Luar, dll.
- **Fitur Kustomisasi:** Kemampuan menambah/mengedit/menghapus kategori (CRUD Categories).

---

### C. Modern Dashboard UI/UX
Tampilan dashboard harus bersih, intuitif, dan responsif (Mobile & Desktop Friendly) dengan elemen:
1. **Summary Cards (At-a-Glance):**
   - Total Saldo Utama
   - Total Sub-Saldo Rumah Tangga
   - Total Sub-Saldo Personal
   - Total Pemasukan Bulan Ini
   - Total Pengeluaran Bulan Ini
2. **Interactive Visual Charts:**
   - Grafik Tren Pemasukan vs Pengeluaran (Line / Bar Chart).
   - Diagram Lingkaran (Pie Chart / Donut Chart) Distribusi Pengeluaran berdasarkan Kategori.
   - Diagram Perbandingan Pengeluaran per Sumber Saldo.
3. **Quick Action Buttons:** Tombol cepat "Tambah Transaksi", "Alokasi Sub-Saldo", "Lihat Laporan".
4. **Recent Transactions Widget:** Tabel 5–10 transaksi terakhir dengan indikator warna (Hijau = Pemasukan, Merah = Pengeluaran, Biru = Alokasi Dana).

---

### D. Fitur Laporan Keuangan (Reports & Analytics)
Aplikasi harus menyediakan 2 tingkatan laporan:

1. **Laporan Garis Besar (High-Level Summary Report):**
   - Ringkasan total cashflow harian, mingguan, bulanan, dan tahunan.
   - Perbandingan alokasi anggaran vs realisasi pengeluaran sub-saldo.
   - Net Cash Flow (Total Pemasukan - Total Pengeluaran).

2. **Laporan Transaksi Detail (Detailed Transaction Report):**
   - Tabel riwayat lengkap transaksi dengan filter lanjutan:
     - Rentang Tanggal (Date Range Picker).
     - Sumber Saldo (Saldo Utama / Sub Rumah Tangga / Sub Personal).
     - Jenis Transaksi (Pemasukan / Pengeluaran / Transfer Alokasi).
     - Kategori Transaksi.
   - Fitur Pencarian (Search Bar) berdasarkan keterangan/catatan.
   - Fitur Ekspor Data (PDF / CSV / Excel).

---

## 3. Spesifikasi Teknis yang Direkomendasikan (Tech Stack Suggestion)
Silakan tentukan atau ikuti rekomendasi berikut:
- **Frontend:** React.js / Next.js / Vue.js + Tailwind CSS (menggunakan Shadcn UI atau Flowbite untuk komponen modern).
- **Backend:** Node.js (Express) / Python (FastAPI) / Laravel / Supabase.
- **Database:** PostgreSQL / MySQL.
- **Charts Library:** Chart.js / Recharts / ApexCharts.

---

## 4. Output yang Diharapkan (Expected Deliverables)

1. **Skema Database (Database Schema / ERD):**
   - Tabel `Users`, `Accounts/Balances`, `Categories`, `Transactions`, dan `Transfers`.
2. **Arsitektur API / Endpoint Specification:**
   - Endpoint untuk CRUD Transaksi, Transfer Alokasi, dan Fetch Data Dashboard/Laporan.
3. **Wireframe Layout / Struktur Komponen UI:**
   - Gambaran tata letak Dashboard, Form Transaksi, dan Halaman Laporan.
4. **Kode Sumber (Source Code Implementation):**
   - Sediakan kode modular untuk skema database, logika backend alokasi/pengeluaran saldo, serta komponen dashboard frontend.