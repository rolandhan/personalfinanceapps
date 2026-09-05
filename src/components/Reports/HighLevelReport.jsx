import React from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, Scale, Home, User, PieChart } from 'lucide-react';
import { formatIDR } from '../../utils/formatters';

export const HighLevelReport = ({ accounts, transactions }) => {
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netCashFlow = totalIncome - totalExpense;

  // Sub-account allocation vs realization
  const totalHouseholdAllocated = transactions
    .filter(t => t.type === 'ALLOCATION' && t.toAccountId === 'acc-household')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalHouseholdSpent = transactions
    .filter(t => t.type === 'EXPENSE' && t.accountId === 'acc-household')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalPersonalAllocated = transactions
    .filter(t => t.type === 'ALLOCATION' && t.toAccountId === 'acc-personal')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalPersonalSpent = transactions
    .filter(t => t.type === 'EXPENSE' && t.accountId === 'acc-personal')
    .reduce((sum, t) => sum + Number(t.amount), 0);

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Household Realization */}
        <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Home size={16} color="#10B981" /> Sub Rumah Tangga
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Realisasi: {formatIDR(totalHouseholdSpent)} / {formatIDR(totalHouseholdAllocated)}
            </span>
          </div>
          <div style={{ background: 'var(--bg-primary)', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '0.5rem' }}>
            <div
              style={{
                width: `${Math.min(100, totalHouseholdAllocated > 0 ? (totalHouseholdSpent / totalHouseholdAllocated) * 100 : 0)}%`,
                height: '100%',
                background: totalHouseholdSpent > totalHouseholdAllocated ? '#EF4444' : '#10B981',
                borderRadius: '5px',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Sisa Alokasi Terpakai:{' '}
            {totalHouseholdAllocated > 0
              ? `${((totalHouseholdSpent / totalHouseholdAllocated) * 100).toFixed(1)}%`
              : 'Belum ada alokasi'}
          </div>
        </div>

        {/* Personal Realization */}
        <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} color="#8B5CF6" /> Sub Personal
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Realisasi: {formatIDR(totalPersonalSpent)} / {formatIDR(totalPersonalAllocated)}
            </span>
          </div>
          <div style={{ background: 'var(--bg-primary)', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '0.5rem' }}>
            <div
              style={{
                width: `${Math.min(100, totalPersonalAllocated > 0 ? (totalPersonalSpent / totalPersonalAllocated) * 100 : 0)}%`,
                height: '100%',
                background: totalPersonalSpent > totalPersonalAllocated ? '#EF4444' : '#8B5CF6',
                borderRadius: '5px',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Sisa Alokasi Terpakai:{' '}
            {totalPersonalAllocated > 0
              ? `${((totalPersonalSpent / totalPersonalAllocated) * 100).toFixed(1)}%`
              : 'Belum ada alokasi'}
          </div>
        </div>
      </div>
    </div>
  );
};
