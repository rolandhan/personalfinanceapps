import React from 'react';
import { ArrowUpRight, ArrowDownRight, ArrowRightLeft, Trash2, Edit3, ListOrdered } from 'lucide-react';
import { formatIDR, formatDate } from '../utils/formatters';

export const RecentTransactions = ({ transactions, accounts, categories, onDeleteTransaction, onEditTransaction, onViewAll }) => {
  const getAccountName = (accId) => {
    if (!accId) return '-';
    const acc = accounts.find(a => a.id === accId);
    if (!acc) return accId;
    if (acc.type === 'PRIMARY') return 'Saldo Utama';
    if (acc.type === 'HOUSEHOLD_SUB') return 'Sub RT';
    if (acc.type === 'PERSONAL_SUB') return 'Sub Personal';
    return acc.name;
  };

  const getCategoryName = (catId, fallback) => {
    if (fallback) return fallback;
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : 'Umum';
  };

  const recentList = transactions.slice(0, 10);

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div className="chart-card-title" style={{ margin: 0 }}>
          <ListOrdered size={20} color="#3B82F6" />
          <span>Transaksi Terakhir</span>
        </div>
        <button className="btn btn-outline" onClick={onViewAll} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
          Lihat Semua ({transactions.length})
        </button>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Keterangan</th>
              <th>Sumber Saldo / Alokasi</th>
              <th>Kategori</th>
              <th>Tipe</th>
              <th style={{ textAlign: 'right' }}>Nominal</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {recentList.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  Belum ada transaksi recorded. Klik 'Tambah Transaksi' untuk memulai.
                </td>
              </tr>
            ) : (
              recentList.map((t) => (
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
                  <td>{t.type === 'ALLOCATION' ? '-' : getCategoryName(t.categoryId, t.categoryName)}</td>
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
                          style={{
                            padding: '0.3rem',
                            borderRadius: '6px',
                            border: 'none',
                            color: '#F59E0B',
                            cursor: 'pointer'
                          }}
                          title="Edit Transaksi"
                        >
                          <Edit3 size={16} />
                        </button>
                      )}
                      <button
                        className="btn-outline"
                        onClick={() => onDeleteTransaction(t.id)}
                        style={{
                          padding: '0.3rem',
                          borderRadius: '6px',
                          border: 'none',
                          color: '#EF4444',
                          cursor: 'pointer'
                        }}
                        title="Hapus Transaksi"
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
