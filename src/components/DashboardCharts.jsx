import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { LineChart, PieChart, BarChart2 } from 'lucide-react';
import { formatIDR } from '../utils/formatters';
import { getAccountColor } from '../utils/scopeMeta';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Nama bulan Indonesia
const MONTH_NAMES_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/**
 * Menghasilkan label 6 bulan terakhir (termasuk bulan sekarang) dalam format 'Mon YYYY'
 */
const getLast6MonthsLabels = () => {
  const result = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({
      label: `${MONTH_NAMES_ID[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`,
      yearMonth: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    });
  }
  return result;
};

export const DashboardCharts = ({ transactions, categories, theme, accounts = [] }) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#94A3B8' : '#475569';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

  // ─────────────────────────────────────────────────────────────
  // 1. Line Chart: Income vs Expense Trend (6 Bulan Terakhir - Data Real)
  // ─────────────────────────────────────────────────────────────
  const last6Months = getLast6MonthsLabels();
  const monthLabels = last6Months.map(m => m.label);

  const incomeTrend = last6Months.map(m =>
    transactions
      .filter(t => t.type === 'INCOME' && t.date.startsWith(m.yearMonth))
      .reduce((sum, t) => sum + Number(t.amount), 0)
  );

  const expenseTrend = last6Months.map(m =>
    transactions
      .filter(t => t.type === 'EXPENSE' && t.date.startsWith(m.yearMonth))
      .reduce((sum, t) => sum + Number(t.amount), 0)
  );

  const lineData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Pemasukan (Rp)',
        data: incomeTrend,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10B981',
        pointBorderColor: isDark ? '#1E293B' : '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      },
      {
        label: 'Pengeluaran (Rp)',
        data: expenseTrend,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#EF4444',
        pointBorderColor: isDark ? '#1E293B' : '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        labels: { color: textColor, font: { family: 'Plus Jakarta Sans', weight: '600' }, padding: 16 }
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${formatIDR(context.raw)}`
        }
      }
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { family: 'Plus Jakarta Sans' } }
      },
      y: {
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          font: { family: 'Plus Jakarta Sans' },
          callback: (value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(0)}Jt`;
            if (value >= 1000) return `${(value / 1000).toFixed(0)}Rb`;
            return value;
          }
        }
      }
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 2. Donut Chart: Expenses by Category (Data Real)
  // ─────────────────────────────────────────────────────────────
  const expenseTransactions = transactions.filter(t => t.type === 'EXPENSE');
  const catExpenseMap = {};

  expenseTransactions.forEach(t => {
    const cat = categories.find(c => c.id === t.categoryId);
    const catName = cat ? cat.name : (t.categoryName || 'Lain-lain');
    catExpenseMap[catName] = (catExpenseMap[catName] || 0) + Number(t.amount);
  });

  // Sort by value desc, ambil top 7
  const sortedCatEntries = Object.entries(catExpenseMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);

  const categoryLabels = sortedCatEntries.map(e => e[0]);
  const categoryValues = sortedCatEntries.map(e => e[1]);
  const donutColors = ['#EF4444', '#8B5CF6', '#3B82F6', '#F59E0B', '#10B981', '#EC4899', '#06B6D4'];

  const doughnutData = {
    labels: categoryLabels.length > 0
      ? categoryLabels
      : ['Belanja Supermarket', 'Listrik & Air', 'Jajan & Kopi', 'Hiburan', 'Buku Sekolah'],
    datasets: [
      {
        data: categoryValues.length > 0
          ? categoryValues
          : [850000, 350000, 150000, 500000, 500000],
        backgroundColor: donutColors,
        borderWidth: 2,
        borderColor: isDark ? '#1E293B' : '#FFFFFF',
        hoverBorderWidth: 3,
        hoverOffset: 6
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
          font: { family: 'Plus Jakarta Sans', size: 11 },
          padding: 12,
          generateLabels: (chart) => {
            const data = chart.data;
            const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
            return data.labels.map((label, i) => ({
              text: `${label} (${total > 0 ? ((data.datasets[0].data[i] / total) * 100).toFixed(1) : 0}%)`,
              fillStyle: data.datasets[0].backgroundColor[i],
              strokeStyle: data.datasets[0].backgroundColor[i],
              hidden: false,
              index: i
            }));
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.label}: ${formatIDR(context.raw)}`
        }
      }
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 3. Bar Chart: Expense Comparison by Deduction Source (Data Real)
  // Dinamis: satu bar per akun/sumber saldo yang ada.
  // ─────────────────────────────────────────────────────────────
  const expenseByAccount = (accounts || []).map(acc => ({
    id: acc.id,
    name: acc.name,
    color: getAccountColor(acc),
    value: transactions
      .filter(t => t.type === 'EXPENSE' && t.accountId === acc.id)
      .reduce((sum, t) => sum + Number(t.amount), 0)
  }));

  const barData = {
    labels: expenseByAccount.map(e => e.name),
    datasets: [
      {
        label: 'Total Pengeluaran (Rp)',
        data: expenseByAccount.map(e => e.value),
        backgroundColor: expenseByAccount.map(e => `${e.color}D9`),
        borderColor: expenseByAccount.map(e => e.color),
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => ` Pengeluaran: ${formatIDR(context.raw)}`
        }
      }
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { family: 'Plus Jakarta Sans' } }
      },
      y: {
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          font: { family: 'Plus Jakarta Sans' },
          callback: (val) => {
            if (val >= 1000000) return `${(val / 1000000).toFixed(0)}Jt`;
            if (val >= 1000) return `${(val / 1000).toFixed(0)}Rb`;
            return val;
          }
        }
      }
    }
  };

  return (
    <>
      <div className="charts-grid">
        {/* Line Chart - 6 Bulan Terakhir */}
        <div className="glass-card">
          <div className="chart-card-title">
            <LineChart size={20} color="#3B82F6" />
            <span>Tren Pemasukan vs Pengeluaran (6 Bulan Terakhir)</span>
          </div>
          <div style={{ height: '280px' }}>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        {/* Donut Chart - Distribusi Kategori */}
        <div className="glass-card">
          <div className="chart-card-title">
            <PieChart size={20} color="#EF4444" />
            <span>Distribusi Kategori Pengeluaran</span>
          </div>
          <div style={{ height: '280px' }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Bar Chart - Pengeluaran per Sumber Saldo */}
      <div className="glass-card" style={{ marginBottom: '1.75rem' }}>
        <div className="chart-card-title">
          <BarChart2 size={20} color="#8B5CF6" />
          <span>Perbandingan Pengeluaran per Sumber Saldo</span>
        </div>
        <div style={{ height: '240px' }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </>
  );
};
