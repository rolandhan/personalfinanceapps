import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Scale } from 'lucide-react';
import { formatIDR } from '../utils/formatters';
import { AccountIcon } from '../utils/accountIcons';
import { getPrimaryAccount, getSubAccounts, getAccountColor, getAccountIcon, getAccountFooter } from '../utils/scopeMeta';

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const SummaryCards = ({ accounts, transactions }) => {
  const primaryAcc = getPrimaryAccount(accounts) || { id: 'acc-primary', balance: 0, name: 'Saldo Utama' };
  const subAccounts = getSubAccounts(accounts);

  // Calculate current month income and expense (dinamis berdasarkan tanggal sekarang)
  const now = new Date();
  const currentMonthStr = now.toISOString().substring(0, 7); // YYYY-MM
  const currentMonthName = MONTH_NAMES_ID[now.getMonth()];
  const currentYear = now.getFullYear();

  const monthlyIncome = transactions
    .filter(t => t.type === 'INCOME' && t.date.startsWith(currentMonthStr))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthlyExpense = transactions
    .filter(t => t.type === 'EXPENSE' && t.date.startsWith(currentMonthStr))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netCashFlow = monthlyIncome - monthlyExpense;

  // Hitung perubahan dibanding bulan lalu (untuk indikator trend)
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthStr = prevMonthDate.toISOString().substring(0, 7);
  const prevMonthIncome = transactions
    .filter(t => t.type === 'INCOME' && t.date.startsWith(prevMonthStr))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const primaryColor = getAccountColor(primaryAcc);
  const primaryIcon = getAccountIcon(primaryAcc);

  return (
    <div className="summary-grid">
      {/* 1. Saldo Utama Card */}
      <div className="glass-card card-primary-account">
        <div className="summary-card-header">
          <span className="summary-card-title">Saldo Utama</span>
          <div className="summary-card-icon" style={{ background: `${primaryColor}33`, color: primaryColor }}>
            <AccountIcon name={primaryIcon} size={20} />
          </div>
        </div>
        <div className="summary-card-value" style={{ color: primaryColor }}>
          {formatIDR(primaryAcc.balance)}
        </div>
        <div className="summary-card-footer">
          <span>Sumber dana induk (Gaji / Rekening)</span>
        </div>
      </div>

      {/* Sub-Saldo Cards (dinamis mengikuti pos yang ada) */}
      {subAccounts.map((acc) => {
        const accColor = getAccountColor(acc);
        const accIcon = getAccountIcon(acc);
        return (
          <div className="glass-card" key={acc.id} style={{ borderLeft: `4px solid ${accColor}` }}>
            <div className="summary-card-header">
              <span className="summary-card-title">{acc.name}</span>
              <div className="summary-card-icon" style={{ background: `${accColor}33`, color: accColor }}>
                <AccountIcon name={accIcon} size={20} />
              </div>
            </div>
            <div className="summary-card-value" style={{ color: accColor }}>
              {formatIDR(acc.balance)}
            </div>
            <div className="summary-card-footer">
              <span>{getAccountFooter(acc)}</span>
            </div>
          </div>
        );
      })}

      {/* 2. Total Pemasukan Bulan Ini */}
      <div className="glass-card">
        <div className="summary-card-header">
          <span className="summary-card-title">Pemasukan {currentMonthName}</span>
          <div className="summary-card-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
            <TrendingUp size={20} />
          </div>
        </div>
        <div className="summary-card-value" style={{ color: '#10B981' }}>
          {formatIDR(monthlyIncome)}
        </div>
        <div className="summary-card-footer" style={{ color: '#10B981' }}>
          <ArrowUpRight size={14} />
          <span>
            {prevMonthIncome > 0 && monthlyIncome > 0
              ? monthlyIncome >= prevMonthIncome
                ? `▲ naik vs bulan lalu`
                : `▼ turun vs bulan lalu`
              : `Total Pemasukan ${currentMonthName} ${currentYear}`}
          </span>
        </div>
      </div>

      {/* 3. Total Pengeluaran Bulan Ini */}
      <div className="glass-card">
        <div className="summary-card-header">
          <span className="summary-card-title">Pengeluaran {currentMonthName}</span>
          <div className="summary-card-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}>
            <TrendingDown size={20} />
          </div>
        </div>
        <div className="summary-card-value" style={{ color: '#EF4444' }}>
          {formatIDR(monthlyExpense)}
        </div>
        <div className="summary-card-footer" style={{ color: '#EF4444' }}>
          <ArrowDownRight size={14} />
          <span>Total Realisasi Pengeluaran</span>
        </div>
      </div>

      {/* 4. Net Cash Flow Bulan Ini */}
      <div className="glass-card">
        <div className="summary-card-header">
          <span className="summary-card-title">Net Cash Flow</span>
          <div
            className="summary-card-icon"
            style={{
              background: netCashFlow >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: netCashFlow >= 0 ? '#10B981' : '#EF4444'
            }}
          >
            <Scale size={20} />
          </div>
        </div>
        <div className="summary-card-value" style={{ color: netCashFlow >= 0 ? '#10B981' : '#EF4444' }}>
          {netCashFlow >= 0 ? '+' : ''}{formatIDR(netCashFlow)}
        </div>
        <div className="summary-card-footer" style={{ color: netCashFlow >= 0 ? '#10B981' : '#EF4444' }}>
          <span>
            {netCashFlow >= 0 ? '✅ Surplus' : '⚠️ Defisit'} — {currentMonthName} {currentYear}
          </span>
        </div>
      </div>
    </div>
  );
};
