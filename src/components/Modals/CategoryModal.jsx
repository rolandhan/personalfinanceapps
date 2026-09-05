import React, { useState } from 'react';
import { X, Tag, Plus, Trash2, Search } from 'lucide-react';

export const CategoryModal = ({ isOpen, onClose, categories, onAddCategory, onDeleteCategory }) => {
  // Semua hooks wajib dipanggil SEBELUM early return (Rules of Hooks)
  const [scope, setScope] = useState('HOUSEHOLD_EXPENSE');
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddCategory({
      scope,
      name: name.trim(),
      color,
      icon: 'Tag'
    });

    setName('');
  };

  const getScopeBadge = (s) => {
    if (s === 'INCOME') return <span className="badge badge-income">💰 Pemasukan</span>;
    if (s === 'HOUSEHOLD_EXPENSE') return <span className="badge badge-expense">🏠 Pengeluaran RT</span>;
    return <span className="badge badge-allocation">👤 Personal</span>;
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const incomeCategories = filteredCategories.filter(c => c.scope === 'INCOME');
  const householdCategories = filteredCategories.filter(c => c.scope === 'HOUSEHOLD_EXPENSE');
  const personalCategories = filteredCategories.filter(c => c.scope === 'PERSONAL_EXPENSE');

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <div className="modal-title">
            <Tag size={20} color="#10B981" />
            <span>Kelola Kategori Transaksi</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Add Category Form */}
          <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} color="#10B981" /> Tambah Kategori Kustom Baru
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 52px', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
              <select
                className="form-control"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
              >
                <option value="HOUSEHOLD_EXPENSE">🏠 Pengeluaran RT</option>
                <option value="PERSONAL_EXPENSE">👤 Pengeluaran Personal</option>
                <option value="INCOME">💰 Pemasukan</option>
              </select>

              <input
                type="text"
                className="form-control"
                placeholder="Nama kategori baru..."
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
                title="Pilih Warna Kategori"
              />
            </div>
            <button type="submit" className="btn btn-success" style={{ width: '100%', padding: '0.55rem' }}>
              <Plus size={16} /> Tambah Kategori
            </button>
          </form>

          {/* Search Bar */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Cari kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Total: <strong>{categories.length}</strong> kategori
            </span>
            <span style={{ fontSize: '0.78rem', color: '#10B981' }}>
              💰 Pemasukan: <strong>{incomeCategories.length}</strong>
            </span>
            <span style={{ fontSize: '0.78rem', color: '#EF4444' }}>
              🏠 RT: <strong>{householdCategories.length}</strong>
            </span>
            <span style={{ fontSize: '0.78rem', color: '#8B5CF6' }}>
              👤 Personal: <strong>{personalCategories.length}</strong>
            </span>
          </div>

          {/* List of Existing Categories */}
          <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
            Daftar Kategori Terdaftar ({filteredCategories.length})
          </h4>
          <div style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Warna</th>
                  <th>Nama Kategori</th>
                  <th>Lingkup (Scope)</th>
                  <th style={{ textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                      Tidak ada kategori yang cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat) => (
                    <tr key={cat.id}>
                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            backgroundColor: cat.color || '#3B82F6',
                            boxShadow: `0 0 6px ${cat.color || '#3B82F6'}60`
                          }}
                        />
                      </td>
                      <td style={{ fontWeight: 600 }}>{cat.name}</td>
                      <td>{getScopeBadge(cat.scope)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="btn-outline"
                          onClick={() => onDeleteCategory(cat.id)}
                          style={{ padding: '0.25rem 0.5rem', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                          title="Hapus Kategori"
                        >
                          <Trash2 size={14} /> Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
