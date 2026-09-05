# Panduan Konfigurasi MySQL Portabel (XAMPP / MariaDB Portable)

Dokumen ini menjelaskan tata cara mengoperasikan basis data **MySQL Portabel** tanpa perlu melakukan instalasi sistem permanen di komputer Windows.

---

## 1. Keuntungan Menggunakan MySQL Portabel

- **Tanpa Install / Zero Installation:** Dapat dijalankan langsung dari Flashdisk (USB Drive) atau folder portabel.
- **Ringan & Cepat:** Bebas dari service background yang memberatkan RAM komputer saat tidak digunakan.
- **Portabilitas Tinggi:** Data keuangan dapat dipindahkan antar komputer cukup dengan menyalin folder XAMPP Portable.

---

## 2. Langkah Konfigurasi

### Step 1: Download & Ekstrak XAMPP Portable
1. Unduh paket `xampp-portable-windows-x64-*.zip` dari situs resmi Apache Friends / SourceForge.
2. Ekstrak isi zip ke direktori pilihan Anda, misal: `C:\xampp-portable\` atau `D:\Tools\xampp-portable\`.

### Step 2: Menjalankan MySQL Service Portabel
1. Buka folder `xampp-portable`.
2. Klik ganda pada file `xampp-control.exe`.
3. Di baris **MySQL**, klik tombol **Start**.
4. Pastikan indikator status MySQL berubah menjadi warna hijau dengan Port `3306`.

---

## 3. Import Skema Database FinanceCraft

1. Buka browser dan ketik alamat: `http://localhost/phpmyadmin`
2. Klik tab **Databases**, ketik nama database: `financecraft_db`, lalu klik **Create**.
3. Pilih database `financecraft_db` yang baru dibuat, lalu klik tab **Import**.
4. Klik **Choose File** dan pilih file SQL dari project FinanceCraft:
   - File location: [`server/schema.sql`](file:///d:/PRIVATE/Aplikasi%20Keuangan/server/schema.sql)
5. Klik **Go** / **Import**. Seluruh tabel (`users`, `accounts`, `categories`, `transactions`, `transfers`) akan otomatis terbuat.

---

## 4. Menjalankan Backend Connection Node.js

Jalankan backend server Node.js yang sudah dilengkapi driver MySQL:
```bash
node server/server.js
```

Backend server akan otomatis mendengarkan di `http://localhost:5000` dan terhubung langsung ke MySQL Portabel Anda.
