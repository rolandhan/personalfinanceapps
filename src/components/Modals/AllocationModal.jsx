import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, Info } from 'lucide-react';
import { formatIDR } from '../../utils/formatters';

export const AllocationModal = ({ isOpen, onClose, onSubmit, accounts }) => {
  // Semua hooks wajib dipanggil SEBELUM early return (Rules of Hooks)
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const primaryAcc = accounts.find(a => a.type === 'PRIMARY') || { id: 'acc-primary', balance: 0 };
  const subAccounts = accounts.filter(a => a.type !== 'PRIMARY');

  // Reset form setiap kali modal dibuka
  useEffect(() => {
    if (isOpen) {
      setToAccountId(subAccounts[0]?.id || 'acc-household');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedTargetAcc = accounts.find(a => a.id === toAccountId);
  const numAmount = Number(amount);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!numAmount || numAmount <= 0) {
      alert('Masukkan nominal alokasi yang valid.');
      return;
    }

    if (primaryAcc.balance < numAmount) {
      alert(`Saldo Utama tidak mencukupi.\nSaldo tersedia: ${formatIDR(primaryAcc.balance)}\nNominal alokasi: ${formatIDR(numAmount)}`);
      return;
    }

    try {
      onSubmit({
        fromAccountId: primaryAcc.id,
        toAccountId,
        amount: numAmount,
        date,
        description: description || `Alokasi Dana ke ${selectedTargetAcc?.name || 'Sub-Saldo'}`
      });
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            <ArrowRightLeft size={20} color="#8B5CF6" />
            <span>Alokasi Saldo Utama ke Sub-Account</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="alert-info" style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Aturan Alokasi Dana:</strong> Transaksi alokasi memotong <strong>Saldo Utama</strong> dan menambah saldo <strong>Sub-Account</strong> yang dipilih. Transaksi ini <strong>tidak dihitung sebagai pengeluaran akhir</strong>.
              </div>
            </div>

            {/* Saldo Asal Info */}
            <div className="form-group">
              <label className="form-label">Saldo Asal (Primary Account)</label>
              <input
                type="text"
                className="form-control"
                value={`✦ Saldo Utama — Tersedia: ${formatIDR(primaryAcc.balance)}`}
                disabled
                style={{ opacity: 0.8, fontWeight: 600 }}
              />
            </div>

            {/* Sub-Account Target */}
            <div className="form-group">
              <label className="form-label">Sub-Saldo Tujuan Alokasi *</label>
              <select
                className="form-control"
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                required
              >
                {subAccounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} — Saldo: {formatIDR(acc.balance)}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div className="form-group">
              <label className="form-label">Nominal Alokasi (Rp) *</label>
              <input
                type="number"
                className="form-control"
                placeholder="Contoh: 3000000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={primaryAcc.balance}
                min="1"
                required
              />
              {numAmount > 0 && (
                <div style={{ fontSize: '0.78rem', marginTop: '0.3rem', color: numAmount > primaryAcc.balance ? '#EF4444' : 'var(--text-muted)' }}>
                  {numAmount > primaryAcc.balance
                    ? `⚠️ Melebihi saldo tersedia (${formatIDR(primaryAcc.balance)})`
                    : `= ${formatIDR(numAmount)} | Sisa Saldo Utama: ${formatIDR(primaryAcc.balance - numAmount)}`}
                </div>
              )}
            </div>

            {/* Date */}
            <div className="form-group">
              <label className="form-label">Tanggal Alokasi *</label>
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
              <label className="form-label">Catatan Alokasi (Opsional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Contoh: Pos Jatah Belanja RT September"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-purple"
              disabled={numAmount > primaryAcc.balance && numAmount > 0}
            >
              <ArrowRightLeft size={16} /> Proses Alokasi Dana
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
