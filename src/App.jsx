import React, { useState, useEffect } from 'react';
import { authService } from './services/authService';
import { storageService } from './services/storageService';
import { LoginScreen } from './components/LoginScreen';
import { Navbar } from './components/Navbar';
import { SummaryCards } from './components/SummaryCards';
import { QuickActions } from './components/QuickActions';
import { DashboardCharts } from './components/DashboardCharts';
import { RecentTransactions } from './components/RecentTransactions';
import { HighLevelReport } from './components/Reports/HighLevelReport';
import { DetailedReport } from './components/Reports/DetailedReport';
import { UserManagement } from './components/UserManagement';
import { TransactionModal } from './components/Modals/TransactionModal';
import { AllocationModal } from './components/Modals/AllocationModal';
import { CategoryModal } from './components/Modals/CategoryModal';
import { SubAccountModal } from './components/Modals/SubAccountModal';
import { EditTransactionModal } from './components/Modals/EditTransactionModal';
import { UserGuideModal } from './components/Modals/UserGuideModal';
import { SupabaseConfigModal } from './components/Modals/SupabaseConfigModal';

export const App = () => {
  // Auth State
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());

  // User Management State (For Super Admin)
  const [users, setUsers] = useState(() => authService.getUsers());

  const handleRefreshUsers = () => {
    setUsers(authService.getUsers());
  };

  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('fc_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fc_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // App Navigation Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Application Data State
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Modal States
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('EXPENSE');
  const [isAllocationOpen, setIsAllocationOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isSupabaseConfigOpen, setIsSupabaseConfigOpen] = useState(false);

  // Load User Data (Async for Supabase PostgreSQL & LocalStorage)
  const loadUserData = async (userEmail) => {
    if (!userEmail) return;
    try {
      const [accs, cats, trxs] = await Promise.all([
        storageService.getAccountsAsync(userEmail),
        storageService.getCategoriesAsync(userEmail),
        storageService.getTransactionsAsync(userEmail)
      ]);
      setAccounts(accs);
      setCategories(cats);
      setTransactions(trxs);
    } catch (e) {
      console.error('Gagal memuat data keuangan:', e);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadUserData(currentUser.email);
    }
  }, [currentUser]);

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    loadUserData(user.email);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // Financial Action Handlers
  const handleOpenTransaction = (type = 'EXPENSE') => {
    setTransactionType(type);
    setIsTransactionOpen(true);
  };

  const handleAddTransaction = async (trxData) => {
    if (!currentUser) return;
    await storageService.addTransactionAsync(trxData, currentUser.email);
    await loadUserData(currentUser.email);
  };

  const handleOpenEditTransaction = (trx) => {
    setEditingTransaction(trx);
    setIsEditOpen(true);
  };

  const handleEditTransaction = async (trxId, updatedData) => {
    if (!currentUser) return;
    await storageService.editTransactionAsync(trxId, updatedData, currentUser.email);
    await loadUserData(currentUser.email);
    setIsEditOpen(false);
    setEditingTransaction(null);
  };

  const handleAllocateBalance = async (allocationData) => {
    if (!currentUser) return;
    await storageService.allocateBalanceAsync(allocationData, currentUser.email);
    await loadUserData(currentUser.email);
  };

  const handleAddCategory = async (catData) => {
    if (!currentUser) return;
    await storageService.addCategoryAsync(catData, currentUser.email);
    await loadUserData(currentUser.email);
  };

  const handleDeleteCategory = async (catId) => {
    if (!currentUser) return;
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      await storageService.deleteCategoryAsync(catId, currentUser.email);
      await loadUserData(currentUser.email);
    }
  };

  const handleOpenSubAccounts = () => {
    setIsCategoryOpen(false);
    setActiveTab('subs');
  };

  const handleAddSubAccount = async (subAccountData) => {
    if (!currentUser) return;
    try {
      await storageService.addSubAccountAsync(subAccountData, currentUser.email);
      await loadUserData(currentUser.email);
    } catch (e) {
      alert(e.message || 'Gagal menambahkan Sub-Saldo.');
    }
  };

  const handleDeleteSubAccount = async (acc) => {
    if (!currentUser) return;
    if (!window.confirm(`Apakah Anda yakin ingin menghapus Sub-Saldo "${acc.name}"?`)) return;
    try {
      await storageService.deleteSubAccountAsync(acc.id, currentUser.email);
      await loadUserData(currentUser.email);
    } catch (e) {
      alert(e.message || 'Gagal menghapus Sub-Saldo.');
    }
  };

  const handleDeleteTransaction = async (trxId) => {
    if (!currentUser) return;
    if (window.confirm('Apakah Anda yakin ingin menghapus catatan transaksi ini? Saldo terkait akan dipulihkan.')) {
      await storageService.deleteTransactionAsync(trxId, currentUser.email);
      await loadUserData(currentUser.email);
    }
  };

  // Auth Guard: If not logged in, display LoginScreen
  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {/* Top Navbar with Profile & User Guide Button */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        accounts={accounts}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenAllocation={() => setIsAllocationOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenSupabaseConfig={() => setIsSupabaseConfigOpen(true)}
      />

      {/* Main Dashboard Content */}
      <main style={{ paddingBottom: '5rem' }}>
        {activeTab === 'dashboard' && (
          <>
            {/* Top Balance Summary Cards */}
            <SummaryCards accounts={accounts} transactions={transactions} />

            {/* Quick Action Toolbar */}
            <QuickActions
              onOpenTransaction={handleOpenTransaction}
              onOpenAllocation={() => setIsAllocationOpen(true)}
              onOpenCategory={() => setIsCategoryOpen(true)}
              onOpenSubAccounts={handleOpenSubAccounts}
              onViewReports={() => setActiveTab('reports')}
            />

            {/* Visual Analytics Charts */}
            <DashboardCharts accounts={accounts} transactions={transactions} categories={categories} theme={theme} />

            {/* Recent Transactions Widget */}
            <RecentTransactions
              transactions={transactions}
              accounts={accounts}
              categories={categories}
              onDeleteTransaction={handleDeleteTransaction}
              onEditTransaction={handleOpenEditTransaction}
              onViewAll={() => setActiveTab('reports')}
            />
          </>
        )}

        {activeTab === 'reports' && (
          <>
            {/* High Level Report Summary */}
            <HighLevelReport accounts={accounts} transactions={transactions} />

            {/* Detailed Filterable Report Table */}
            <DetailedReport
              transactions={transactions}
              accounts={accounts}
              categories={categories}
              onDeleteTransaction={handleDeleteTransaction}
              onEditTransaction={handleOpenEditTransaction}
            />
          </>
        )}

        {activeTab === 'categories' && (
          <CategoryModal
            isOpen={true}
            onClose={() => setActiveTab('dashboard')}
            categories={categories}
            accounts={accounts}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onOpenSubAccounts={handleOpenSubAccounts}
          />
        )}

        {activeTab === 'subs' && (
          <SubAccountModal
            isOpen={true}
            onClose={() => setActiveTab('dashboard')}
            accounts={accounts}
            categories={categories}
            onAddSubAccount={handleAddSubAccount}
            onDeleteSubAccount={handleDeleteSubAccount}
          />
        )}

        {activeTab === 'users' && currentUser.role === 'SUPER_ADMIN' && (
          <UserManagement
            users={users}
            onRefreshUsers={handleRefreshUsers}
          />
        )}
      </main>

      {/* Dialog Modals */}
      <TransactionModal
        isOpen={isTransactionOpen}
        onClose={() => setIsTransactionOpen(false)}
        onSubmit={handleAddTransaction}
        accounts={accounts}
        categories={categories}
        initialType={transactionType}
      />

      <EditTransactionModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingTransaction(null); }}
        onSubmit={handleEditTransaction}
        transaction={editingTransaction}
        accounts={accounts}
        categories={categories}
      />

      <AllocationModal
        isOpen={isAllocationOpen}
        onClose={() => setIsAllocationOpen(false)}
        onSubmit={handleAllocateBalance}
        accounts={accounts}
      />

      {isCategoryOpen && (
        <CategoryModal
          isOpen={isCategoryOpen}
          onClose={() => setIsCategoryOpen(false)}
          categories={categories}
          accounts={accounts}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onOpenSubAccounts={handleOpenSubAccounts}
        />
      )}

      {/* User Guide PDF Modal */}
      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Supabase Database Configuration Modal */}
      <SupabaseConfigModal
        isOpen={isSupabaseConfigOpen}
        onClose={() => setIsSupabaseConfigOpen(false)}
      />
    </div>
  );
};

