import React from 'react';
import { ArrowUpRight, ArrowDownRight, Scale, PieChart } from 'lucide-react';
import { formatIDR } from '../../utils/formatters';
import { AccountIcon } from '../../utils/accountIcons';
import { getSubAccounts, getAccountColor, getAccountIcon } from '../../utils/scopeMeta';

export const HighLevelReport = ({ accounts, transactions }) => {
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netCashFlow = totalIncome - totalExpense;

  // Perhitungan Alokasi vs Realisasi tiap Sub-Saldo (dinamis)
  const subAccounts = getSubAccounts(accounts);
  const subRows = subAccounts.map(acc => {
    const allocated = transactions
      .filter(t => t.type === 'ALLOCATION' && t.toAccountId === acc.id)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const spent = transactions
      .filter(t => t.type === 'EXPENSE' && t.accountId === acc.id)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return { acc, allocated, spent };
  });

  return (
    <div className="glass-card" style={{ marginBottom: '1.75rem' }}>
      <div className="chart-card-title">
        <PieChart size={20} color="#3B82F6" />
        <span>Laporan Garis Besar & Realisasi Anggaran (High-Level Report)</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Net Cash Flow */}
        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Scale size={14} color="#3B82F6" /> Net Cash Flow
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: netCashFlow >= 0 ? '#10B981' : '#EF4444' }}>
            {netCashFlow >= 0 ? '+' : ''} {formatIDR(netCashFlow)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            (Total Pemasukan - Total Pengeluaran)
          </div>
        </div>

        {/* Total Income */}
        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowUpRight size={14} color="#10B981" /> Akumulasi Pemasukan
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981' }}>
            {formatIDR(totalIncome)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Dari {transactions.filter(t => t.type === 'INCOME').length} catatan penerimaan
          </div>
        </div>

        {/* Total Expense */}
        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowDownRight size={14} color="#EF4444" /> Akumulasi Pengeluaran
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#EF4444' }}>
            {formatIDR(totalExpense)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Dari {transactions.filter(t => t.type === 'EXPENSE').length} catatan belanja
          </div>
        </div>
      </div>

      {/* Sub-account Realization Progress */}
      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
        Perbandingan Alokasi Anggaran vs Realisasi Pengeluaran Sub-Saldo
      </h4>

      {subRows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '10px' }}>
          Belum ada Sub-Saldo. Tambahkan pos baru lewat menu Sub-Saldo.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {subRows.map(({ acc, allocated, spent }) => {
            const color = getAccountColor(acc);
            const pct = allocated > 0 ? Math.min(100, (spent / allocated) * 100) : 0;
            const overBudget = spent > allocated;
            return (
              <div key={acc.id} style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '7px', background: `${color}1F`, color }}>
                      <AccountIcon name={getAccountIcon(acc)} size={15} />
                    </span>
                    {acc.name}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Realisasi: {formatIDR(spent)} / {formatIDR(allocated)}
                  </span>
                </div>
                <div style={{ background: 'var(--bg-primary)', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: overBudget ? '#EF4444' : color,
                      borderRadius: '5px',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Sisa Alokasi Terpakai:{' '}
                  {allocated > 0
                    ? `${pct.toFixed(1)}%${overBudget ? ' — ⚠️ Melebihi alokasi' : ''}`
                    : 'Belum ada alokasi'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
