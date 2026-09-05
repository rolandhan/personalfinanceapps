# 🚀 Panduan Lengkap Deploy FinanceCraft ke Vercel (Pemula)

Selamat datang di **Vercel**! Vercel adalah platform cloud modern paling populer untuk menayangkan aplikasi web React/Vite secara gratis, cepat, dan otomatis terhubung dengan GitHub.

Berikut adalah langkah-langkah praktis dan mudah dari awal hingga aplikasi Anda dapat diakses secara publik di internet.

---

## 📌 Langkah 1: Push Kode Aplikasi ke GitHub

Sebelum menghubungkan ke Vercel, pastikan kode aplikasi Anda sudah diunggah ke repositori GitHub.

### Opsi A: Menggunakan VS Code / Cursor GUI (Paling Mudah)
1. Buka tab **Source Control** (ikon cabang di sebelah kiri VS Code).
2. Masukkan pesan commit (misal: `Initial commit FinanceCraft`).
3. Klik **Publish Branch** atau **Commit & Push** ke akun GitHub Anda.

### Opsi B: Menggunakan Terminal / PowerShell
Jalankan perintah berikut di folder project Anda:
```bash
git init
git add .
git commit -m "Deploy FinanceCraft pertama kali"
git branch -M main
git remote add origin https://github.com/USERNAME-ANDA/aplikasi-keuangan.git
git push -u origin main
```

---

## 📌 Langkah 2: Buat & Login Akun Vercel

1. Buka situs resmi **[Vercel.com](https://vercel.com)**.
2. Klik tombol **Sign Up** (Daftar).
3. Pilih **Continue with GitHub**. (Rekomendasi utama agar Vercel otomatis terhubung dengan akun GitHub Anda).

---

## 📌 Langkah 3: Import Project ke Vercel

1. Setelah masuk ke Dashboard Vercel, klik tombol **"Add New..."** di pojok kanan atas -> pilih **"Project"**.
2. Vercel akan menampilkan daftar repositori GitHub Anda.
3. Cari repositori **`aplikasi-keuangan`** (atau nama repositori Anda) -> klik tombol **"Import"**.

---

## 📌 Langkah 4: Pengaturan Konfigurasi (Build & Environment Variables)

Pada halaman **Configure Project**:

1. **Framework Preset**: Vercel akan otomatis mendeteksi **Vite**. (Biarkan default).
2. **Root Directory**: Biarkan `./`.
3. **Environment Variables (PENTING untuk Supabase Database)**:
   Buka bagian **Environment Variables** lalu tambahkan 2 variabel berikut dari Supabase Anda:

   | Key / Nama Variabel | Value / Nilai |
   |---|---|
   | `VITE_SUPABASE_URL` | `https://xyzxyz.supabase.co` *(Salin dari Supabase Project Settings -> API)* |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhY2Nlb...` *(Salin dari Supabase Project Settings -> API)* |

4. Setelah mengisi variabel lingkungan, klik tombol biru **"Deploy"**!

---

## 📌 Langkah 5: Proses Deployment Selesai! 🎉

1. Tunggu proses build selama kurang lebih 30-60 detik.
2. Anda akan disambut dengan kembang api konfeti dari Vercel! 🎆
3. Klik pada screenshot preview atau URL link yang diberikan (misal: `https://aplikasi-keuangan-xxx.vercel.app`) untuk membuka website keuangan Anda yang sudah live online!

---

## 📌 Langkah 6 (Opsional): Daftarkan URL Vercel di Supabase

Agar basis data Supabase mengizinkan akses dari domain Vercel Anda:
1. Salin URL website Vercel Anda (misal: `https://aplikasi-keuangan-xxx.vercel.app`).
2. Buka **[Supabase Dashboard](https://supabase.com/dashboard)** -> Pilih Project Anda.
3. Masuk ke **Authentication** -> **URL Configuration**.
4. Di bagian **Site URL**, masukkan URL website Vercel Anda.
5. Pada **Redirect URLs**, klik **Add URL** dan masukkan URL Vercel Anda.
6. Klik **Save**.

---

## 💡 Keunggulan Vercel yang Perlu Anda Ketahui:
- **Automatic Deployment**: Setiap kali Anda melakukan perbaikan kode dan melakukan `git push` ke GitHub, Vercel akan **otomatis melakukan update/deploy ulang** dalam hitungan detik!
- **Gratis SSL (HTTPS)**: Website Anda otomatis aman menggunakan protokol `https://` resmi.
- **Performa Tinggi**: Menggunakan Edge Network CDN global sehingga aplikasi sangat cepat diakses dari mana saja.
