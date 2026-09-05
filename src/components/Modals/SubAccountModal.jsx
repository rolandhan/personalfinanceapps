import React, { useState } from 'react';
import { X, Plus, Trash2, Boxes, Info } from 'lucide-react';
import { formatIDR } from '../../utils/formatters';
import { getSubAccounts, getAccountScopeCode, getAccountShortLabel, getAccountIcon, getScopeMeta, POS_PALETTE } from '../../utils/scopeMeta';
import { ACCOUNT_ICON_OPTIONS, AccountIcon } from '../../utils/accountIcons';

export const SubAccountModal = ({ isOpen, onClose, accounts, categories, onAddSubAccount, onDeleteSubAccount }) => {
  // Semua hooks wajib dipanggil SEBELUM early return (Rules of Hooks)
  const [name, setName] = useState('');
  const [color, setColor] = useState(POS_PALETTE[0]);
  const [icon, setIcon] = useState(ACCOUNT_ICON_OPTIONS[0].name);

  if (!isOpen) return null;

  const subAccounts = getSubAccounts(accounts);

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = name.trim();
    if (!clean) return;

    try {
      onAddSubAccount({ name: clean, color, icon });
    } catch (err) {
      alert(err.message);
      return;
    }

    // Lanjut ke pilihan warna/ikon berikutnya supaya tiap pos baru beda warna
    const nextColorIdx = (POS_PALETTE.indexOf(color) + 1) % POS_PALETTE.length;
    setName('');
    setColor(POS_PALETTE[nextColorIdx]);
    setIcon(ACCOUNT_ICON_OPTIONS[(subAccounts.length + 1) % ACCOUNT_ICON_OPTIONS.length].name);
  };

  const handleDelete = (acc) => {
    try {
      onDeleteSubAccount(acc);
    } catch (err) {
      alert(err.message);
    }
  };

  const countCategories = (acc) => {
    const scope = getAccountScopeCode(acc);
    if (!scope) return 0;
    return (categories || []).filter(c => c.scope === scope).length;
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <div className="modal-title">
            <Boxes size={20} color="#3B82F6" />
            <span>Kelola Sub-Saldo / Pos</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Info / alur singkat */}
          <div className="alert-info" style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.85rem' }}>
              Setiap pos baru otomatis punya <strong>jenis pengeluaran (scope)</strong> sendiri, muncul sebagai
              kartu saldo di dashboard, dan bisa diisi dana lewat <strong>Alokasi Saldo</strong>. Saldo awal Rp 0.
            </div>
          </div>

          {/* Form Tambah Sub-Saldo */}
          <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} color="#3B82F6" /> Tambah Sub-Saldo / Pos Baru
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 52px', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
              <select
                className="form-control"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                title="Ikon Pos"
              >
                {ACCOUNT_ICON_OPTIONS.map(opt => (
                  <option key={opt.name} value={opt.name}>{opt.label} ({opt.name})</option>
                ))}
              </select>

              <input
                type="text"
                className="form-control"
                placeholder="Nama pos, contoh: Bisnis / Anak / Kesehatan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="color"
                className="form-control"
                style={{ padding: '0.2rem', cursor: 'pointer', height: '42px', width: '100%' }}
                value={color}
                onChange={(e) => setColor(e.target.value)}
                title="Pilih Warna Pos"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.55rem' }}>
              <Plus size={16} /> Tambah Sub-Saldo
            </button>
          </form>

          {/* Daftar Sub-Saldo */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
              Daftar Sub-Saldo ({subAccounts.length})
            </h4>
          </div>

          {subAccounts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
              Belum ada Sub-Saldo. Tambahkan pos baru di atas.
            </div>
          ) : (
            <div style={{ maxHeight: '320px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center' }}>Ikon</th>
                    <th>Nama Pos</th>
                    <th>Jenis Pengeluaran</th>
                    <th style={{ textAlign: 'right' }}>Saldo</th>
                    <th style={{ textAlign: 'center' }}>Kategori</th>
                    <th style={{ textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {subAccounts.map((acc) => {
                    const scope = getAccountScopeCode(acc);
                    const meta = getScopeMeta(scope, accounts);
                    const catCount = countCategories(acc);
                    return (
                      <tr key={acc.id}>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', borderRadius: '8px', background: `${meta.color}1F`, color: meta.color }}>
                            <AccountIcon name={getAccountIcon(acc)} size={16} />
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{acc.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{getAccountShortLabel(acc)}</div>
                        </td>
                        <td>
                          <span className="badge" style={{ background: `${meta.color}1A`, color: meta.color, border: `1px solid ${meta.color}40` }}>
                            {meta.label}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatIDR(acc.balance)}</td>
                        <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{catCount}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="btn-outline"
                            onClick={() => handleDelete(acc)}
                            style={{ padding: '0.25rem 0.5rem', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                            title="Hapus Sub-Saldo"
                          >
                            <Trash2 size={14} /> Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Catatan syarat hapus */}
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            ℹ️ Sub-Saldo hanya bisa dihapus bila saldonya Rp 0 dan belum dipakai transaksi. Kategori milik pos ikut terhapus.
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
