import React, { useState } from 'react';
import { Search, Download, Printer, Filter, Trash2, Edit3, ArrowUpRight, ArrowDownRight, ArrowRightLeft } from 'lucide-react';
import { formatIDR, formatDate, exportToCSV } from '../../utils/formatters';

export const DetailedReport = ({ transactions, accounts, categories, onDeleteTransaction, onEditTransaction }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [accountFilter, setAccountFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    // Date range
    if (startDate && t.date < startDate) return false;
    if (endDate && t.date > endDate) return false;

    // Account / Deduction source
    if (accountFilter !== 'ALL') {
      if (t.type === 'ALLOCATION') {
        if (t.fromAccountId !== accountFilter && t.toAccountId !== accountFilter) return false;
      } else {
        if (t.accountId !== accountFilter) return false;
      }
    }

    // Type filter
    if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;

    // Category filter
    if (categoryFilter !== 'ALL' && t.categoryId !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const descMatch = (t.description || '').toLowerCase().includes(q);
      const catMatch = (t.categoryName || '').toLowerCase().includes(q);
      if (!descMatch && !catMatch) return false;
    }

    return true;
  });

  const getAccountName = (accId) => {
    if (!accId) return '-';
    const acc = accounts.find(a => a.id === accId);
    if (!acc) return accId;
    if (acc.type === 'PRIMARY') return 'Saldo Utama';
    if (acc.type === 'HOUSEHOLD_SUB') return 'Sub RT';
    if (acc.type === 'PERSONAL_SUB') return 'Sub Personal';
    return acc.name;
  };

  const handleExportCSV = () => {
    const headers = ['Tanggal', 'Keterangan', 'Sumber Saldo / Alokasi', 'Kategori', 'Tipe Transaksi', 'Nominal (Rp)'];
    const rows = filteredTransactions.map(t => [
      t.date,
      t.description || '',
      t.type === 'ALLOCATION' ? `${getAccountName(t.fromAccountId)} -> ${getAccountName(t.toAccountId)}` : getAccountName(t.accountId),
      t.categoryName || 'Umum',
      t.type,
      t.amount
    ]);
    exportToCSV(`Laporan_Keuangan_${new Date().toISOString().substring(0, 10)}.csv`, headers, rows);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="chart-card-title" style={{ margin: 0 }}>
          <Filter size={20} color="#10B981" />
          <span>Laporan Transaksi Detail & Filter Lanjutan</span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-success" onClick={handleExportCSV} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <Download size={16} /> Ekspor CSV
          </button>
          <button className="btn btn-outline" onClick={handlePrintPDF} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <Printer size={16} /> Cetak / Simpan PDF
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="filter-bar">
        {/* Date From */}
        <div>
          <label className="form-label">Dari Tanggal</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* Date To */}
        <div>
          <label className="form-label">Sampai Tanggal</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Source Account Filter */}
        <div>
          <label className="form-label">Sumber Saldo</label>
          <select
            className="form-control"
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
          >
            <option value="ALL">Semua Saldo</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </select>
        </div>

        {/* Transaction Type Filter */}
        <div>
          <label className="form-label">Tipe Transaksi</label>
          <select
            className="form-control"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">Semua Tipe</option>
            <option value="INCOME">Pemasukan</option>
            <option value="EXPENSE">Pengeluaran</option>
            <option value="ALLOCATION">Alokasi Dana</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="form-label">Kategori</label>
          <select
            className="form-control"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Search Bar */}
        <div style={{ gridColumn: 'span 2' }}>
          <label className="form-label">Cari Keterangan</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Ketik kata kunci pencarian..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>
      </div>

      {/* Filtered Data Summary counter */}
      <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Menampilkan <strong>{filteredTransactions.length}</strong> dari <strong>{transactions.length}</strong> transaksi recorded.
      </div>

      {/* Detailed Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Keterangan / Catatan</th>
              <th>Sumber Saldo</th>
              <th>Kategori</th>
              <th>Tipe</th>
              <th style={{ textAlign: 'right' }}>Nominal</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  Tidak ada transaksi yang cocok dengan kriteria filter.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t) => (
                <tr key={t.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDate(t.date)}</td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{t.description}</span>
                  </td>
                  <td>
                    {t.type === 'ALLOCATION' ? (
                      <span className="badge badge-source">
                        {getAccountName(t.fromAccountId)} ➔ {getAccountName(t.toAccountId)}
                      </span>
                    ) : (
                      <span className="badge badge-source">{getAccountName(t.accountId)}</span>
                    )}
                  </td>
                  <td>{t.type === 'ALLOCATION' ? '-' : (t.categoryName || 'Umum')}</td>
                  <td>
                    {t.type === 'INCOME' && (
                      <span className="badge badge-income">
                        <ArrowUpRight size={12} /> Pemasukan
                      </span>
                    )}
                    {t.type === 'EXPENSE' && (
                      <span className="badge badge-expense">
                        <ArrowDownRight size={12} /> Pengeluaran
                      </span>
                    )}
                    {t.type === 'ALLOCATION' && (
                      <span className="badge badge-allocation">
                        <ArrowRightLeft size={12} /> Alokasi
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span
                      className={
                        t.type === 'INCOME'
                          ? 'amount-income'
                          : t.type === 'EXPENSE'
                          ? 'amount-expense'
                          : 'amount-allocation'
                      }
                    >
                      {t.type === 'INCOME' ? '+' : t.type === 'EXPENSE' ? '-' : '⇄'}{' '}
                      {formatIDR(t.amount)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                      {onEditTransaction && (
                        <button
                          className="btn-outline"
                          onClick={() => onEditTransaction(t)}
                          style={{ padding: '0.3rem', borderRadius: '6px', border: 'none', color: '#F59E0B', cursor: 'pointer' }}
                          title="Edit Transaksi"
                        >
                          <Edit3 size={16} />
                        </button>
                      )}
                      <button
                        className="btn-outline"
                        onClick={() => onDeleteTransaction(t.id)}
                        style={{ padding: '0.3rem', borderRadius: '6px', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                        title="Hapus Record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
