import React, { useState, useEffect } from 'react';
import { X, PlusCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatIDR } from '../../utils/formatters';
import { getScopeOptionSuffix } from '../../utils/scopeMeta';

export const TransactionModal = ({ isOpen, onClose, onSubmit, accounts, categories, initialType = 'EXPENSE' }) => {
  // Semua hooks wajib dipanggil SEBELUM early return (Rules of Hooks)
  const [type, setType] = useState(initialType);
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  // Reset form setiap kali modal dibuka dengan tipe baru
  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setAccountId(accounts[0]?.id || 'acc-primary');
      setCategoryId('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  // Filter categories based on transaction type
  // Pengeluaran: semua scope selain INCOME (dinamis mengikuti pos yang ada).
  const availableCategories = categories.filter(c => {
    if (type === 'INCOME') return c.scope === 'INCOME';
    if (type === 'EXPENSE') return c.scope !== 'INCOME';
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

    // Validasi: saldo cukup untuk pengeluaran
    if (type === 'EXPENSE' && selectedAccount) {
      if (selectedAccount.balance < Number(amount)) {
        if (!window.confirm(`⚠️ Peringatan: Saldo ${selectedAccount.name} tidak mencukupi (${formatIDR(selectedAccount.balance)}). Tetap simpan?`)) {
          return;
        }
      }
    }

    const selectedCategory = categories.find(c => c.id === categoryId);

    onSubmit({
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
            <PlusCircle size={20} color="#3B82F6" />
            <span>Tambah Transaksi Baru</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Type selector tabs */}
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
              {type === 'EXPENSE' && selectedAccount && selectedAccount.balance <= 0 && (
                <div style={{ fontSize: '0.78rem', color: '#EF4444', marginTop: '0.3rem' }}>
                  ⚠️ Saldo akun ini sudah nol atau minus
                </div>
              )}
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
                    {cat.name} ({getScopeOptionSuffix(cat.scope, accounts)})
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
                placeholder="Contoh: Belanja beras & minyak goreng di Hypermart"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className={`btn ${type === 'INCOME' ? 'btn-success' : 'btn-primary'}`}>
              {type === 'INCOME' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              Simpan {type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
