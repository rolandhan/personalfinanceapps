import React from 'react';
import { X, BookOpen, Printer, CheckCircle, Database, ArrowRightLeft, Wallet, Home, User, Download } from 'lucide-react';

export const UserGuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <div className="modal-title">
            <BookOpen size={22} color="#3B82F6" />
            <span>Panduan Penggunaan Aplikasi & Panduan MySQL Portabel</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={handlePrintPDF} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              <Printer size={15} /> Cetak / Simpan PDF
            </button>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
          {/* Header Banner */}
          <div className="alert-info" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem', color: '#3B82F6' }}>
              📘 Panduan Penggunaan FinanceCraft Multi-Saldo
            </h3>
            <p style={{ fontSize: '0.85rem' }}>
              Aplikasi ini membantu Anda mengelola uang gaji secara rapi dengan memisahkan <strong>Saldo Utama</strong>, <strong>Sub-Saldo Rumah Tangga</strong>, dan <strong>Sub-Saldo Personal</strong>.
            </p>
          </div>

          {/* Section 1: Konsep Multi-Saldo */}
          <section style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wallet size={18} color="#3B82F6" /> 1. Mengenal 3 Pos Saldo
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              <div style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: '8px', borderLeft: '4px solid #3B82F6' }}>
                <strong style={{ color: '#3B82F6' }}>1. Saldo Utama</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Penampung gaji & pemasukan induk.
                </p>
              </div>

              <div style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: '8px', borderLeft: '4px solid #10B981' }}>
                <strong style={{ color: '#10B981' }}>2. Sub Rumah Tangga</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Pos operasional RT (Belanja, listrik, sekolah).
                </p>
              </div>

              <div style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: '8px', borderLeft: '4px solid #8B5CF6' }}>
                <strong style={{ color: '#8B5CF6' }}>3. Sub Personal</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Pos hiburan, hobi, jajan & lifestyle pribadi.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Alur Langkah Penggunaan */}
          <section style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} color="#10B981" /> 2. Alur Pengisian & Pengeluaran Gaji
            </h4>

            <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <strong>Langkah 1 (Input Gaji):</strong> Klik <code>+ Tambah Pemasukan</code> ➔ Pilih <code>Saldo Utama</code>. Masukkan nominal gaji bulanan Anda.
              </li>
              <li>
                <strong>Langkah 2 (Bagi Jatah Sub-Saldo):</strong> Klik <code>⇄ Alokasi Sub-Saldo</code> ➔ Pilih <code>Sub Rumah Tangga</code> atau <code>Sub Personal</code>. Masukkan nominal jatah. <em>(Catatan: Alokasi ini TIDAK memotong pengeluaran akhir/uang hilang, melainkan transfer pos)</em>.
              </li>
              <li>
                <strong>Langkah 3 (Belanja / Bayar Tagihan):</strong> Saat belanja RT / pribadi, klik <code>+ Tambah Pengeluaran</code> ➔ Pilih <strong>Sumber Saldo (Deduction Source)</strong> yang sesuai (Sub RT / Sub Personal). Saldo pos tersebut akan berkurang otomatis.
              </li>
            </ol>
          </section>

          {/* Section 3: MySQL Portabel Guide */}
          <section style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={18} color="#F59E0B" /> 3. Panduan Penggunaan MySQL Portabel (XAMPP Portable)
            </h4>
            <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <p style={{ marginBottom: '0.5rem', fontWeight: 600, color: '#F59E0B' }}>
                Apakah bisa menggunakan MySQL Portabel? SANGAT BISA!
              </p>
              <ol style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <li>Ekstrak XAMPP Portable / MariaDB Portable ke folder Komputer / Flashdisk USB Anda.</li>
                <li>Buka <code>xampp-control.exe</code> dan klik tombol <strong>Start</strong> pada baris MySQL (Port 3306).</li>
                <li>Buka <code>http://localhost/phpmyadmin</code> ➔ Buat database baru bernama <code>financecraft_db</code>.</li>
                <li>Import skema SQL yang terletak pada lokasi project: <code>server/schema.sql</code></li>
                <li>Jalankan server backend: <code>node server/server.js</code></li>
              </ol>
            </div>
          </section>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Tutup Panduan
          </button>
          <button className="btn btn-primary" onClick={handlePrintPDF}>
            <Printer size={16} /> Cetak / Simpan Dokumen PDF
          </button>
        </div>
      </div>
    </div>
  );
};
