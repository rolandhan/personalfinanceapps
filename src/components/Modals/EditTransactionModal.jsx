import React, { useState, useEffect } from 'react';
import { X, Edit3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatIDR } from '../../utils/formatters';

export const EditTransactionModal = ({ isOpen, onClose, onSubmit, transaction, accounts, categories }) => {
  // Semua hooks wajib dipanggil SEBELUM early return (Rules of Hooks)
  const [type, setType] = useState('EXPENSE');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  // Populate form fields saat transaction berubah
  useEffect(() => {
    if (isOpen && transaction) {
      setType(transaction.type || 'EXPENSE');
      setAccountId(transaction.accountId || accounts[0]?.id || '');
      setCategoryId(transaction.categoryId || '');
      setAmount(String(transaction.amount || ''));
      setDate(transaction.date || new Date().toISOString().split('T')[0]);
      setDescription(transaction.description || '');
    }
  }, [isOpen, transaction]);

  if (!isOpen || !transaction) return null;

  // Hanya INCOME & EXPENSE yang bisa diedit (ALLOCATION punya logika sendiri)
  if (transaction.type === 'ALLOCATION') {
    return (
      <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="modal-content" style={{ maxWidth: '400px' }}>
          <div className="modal-header">
            <div className="modal-title">
              <Edit3 size={20} color="#F59E0B" />
              <span>Edit Transaksi Alokasi</span>
            </div>
            <button className="close-btn" onClick={onClose}><X size={20} /></button>
          </div>
          <div className="modal-body">
            <div className="alert-info" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#F59E0B' }}>
              ℹ️ Transaksi Alokasi Dana tidak dapat diedit secara langsung karena melibatkan transfer antar saldo.
              Silakan hapus transaksi ini dan buat alokasi baru dengan nominal yang benar.
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={onClose}>Tutup</button>
          </div>
        </div>
      </div>
    );
  }

  // Filter categories based on transaction type
  const availableCategories = categories.filter(c => {
    if (type === 'INCOME') return c.scope === 'INCOME';
    if (type === 'EXPENSE') return c.scope === 'HOUSEHOLD_EXPENSE' || c.scope === 'PERSONAL_EXPENSE';
    return true;
  });

  const selectedAccount = accounts.find(a => a.id === accountId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert('Masukkan nominal transaksi yang valid.');
      return;
    }
    if (!categoryId) {
      alert('Silakan pilih kategori transaksi terlebih dahulu.');
      return;
    }

    const selectedCategory = categories.find(c => c.id === categoryId);

    onSubmit(transaction.id, {
      type,
      accountId,
      categoryId,
      categoryName: selectedCategory ? selectedCategory.name : 'Umum',
      amount: Number(amount),
      date,
      description: description || (type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran')
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            <Edit3 size={20} color="#F59E0B" />
            <span>Edit Transaksi</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Type selector */}
            <div className="form-group">
              <label className="form-label">Tipe Transaksi</label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  className={`btn ${type === 'EXPENSE' ? 'btn-danger' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                  onClick={() => { setType('EXPENSE'); setCategoryId(''); }}
                >
                  <ArrowDownRight size={16} /> Pengeluaran
                </button>
                <button
                  type="button"
                  className={`btn ${type === 'INCOME' ? 'btn-success' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                  onClick={() => { setType('INCOME'); setCategoryId(''); }}
                >
                  <ArrowUpRight size={16} /> Pemasukan
                </button>
              </div>
            </div>

            {/* Deduction Source / Target Account */}
            <div className="form-group">
              <label className="form-label">
                {type === 'EXPENSE' ? 'Sumber Saldo (Deduction Source)' : 'Saldo Tujuan Deposit'}
              </label>
              <select
                className="form-control"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                required
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} — Saldo: {formatIDR(acc.balance)}
                  </option>
                ))}
              </select>
            </div>

            {/* Category selection */}
            <div className="form-group">
              <label className="form-label">Kategori Transaksi *</label>
              <select
                className="form-control"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">-- Pilih Kategori --</option>
                {availableCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.scope === 'HOUSEHOLD_EXPENSE' ? '🏠 Rumah Tangga' : cat.scope === 'PERSONAL_EXPENSE' ? '👤 Personal' : '💰 Pemasukan'})
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div className="form-group">
              <label className="form-label">Nominal (Rp) *</label>
              <input
                type="number"
                className="form-control"
                placeholder="Contoh: 250000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                required
              />
              {amount && Number(amount) > 0 && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  = {formatIDR(Number(amount))}
                </div>
              )}
            </div>

            {/* Date */}
            <div className="form-group">
              <label className="form-label">Tanggal Transaksi *</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Keterangan / Catatan</label>
              <input
                type="text"
                className="form-control"
                placeholder="Keterangan transaksi..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', boxShadow: '0 4px 14px rgba(245,158,11,0.35)' }}>
              <Edit3 size={16} /> Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
