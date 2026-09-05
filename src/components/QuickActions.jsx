import React from 'react';
import { PlusCircle, ArrowRightLeft, Tag, Boxes, FileText } from 'lucide-react';

export const QuickActions = ({ onOpenTransaction, onOpenAllocation, onOpenCategory, onOpenSubAccounts, onViewReports }) => {
  return (
    <div className="quick-actions-bar">
      <button className="btn btn-primary" onClick={() => onOpenTransaction('EXPENSE')}>
        <PlusCircle size={18} />
        <span>Tambah Pengeluaran</span>
      </button>

      <button className="btn btn-success" onClick={() => onOpenTransaction('INCOME')}>
        <PlusCircle size={18} />
        <span>Tambah Pemasukan</span>
      </button>

      <button className="btn btn-purple" onClick={onOpenAllocation}>
        <ArrowRightLeft size={18} />
        <span>Alokasi Sub-Saldo</span>
      </button>

      <button className="btn btn-outline" onClick={onOpenCategory}>
        <Tag size={18} />
        <span>Kelola Kategori</span>
      </button>

      <button className="btn btn-outline" onClick={onOpenSubAccounts}>
        <Boxes size={18} color="#3B82F6" />
        <span>Kelola Sub-Saldo</span>
      </button>

      <button className="btn btn-outline" onClick={onViewReports}>
        <FileText size={18} />
        <span>Lihat Laporan Detail</span>
      </button>
    </div>
  );
};
