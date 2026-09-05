import { isSupabaseConfigured } from './supabaseClient';
import { supabaseService } from './supabaseService';
import { slugify } from '../utils/scopeMeta';

// Storage Service with user-scoped LocalStorage & Supabase hybrid persistence

const getStorageKey = (key, userEmail) => {
  const emailPrefix = userEmail ? userEmail.replace(/[^a-zA-Z0-9]/g, '_') : 'guest';
  return `fc_${emailPrefix}_${key}_v1`;
};

const DEFAULT_ACCOUNTS = [
  {
    id: 'acc-primary',
    type: 'PRIMARY',
    name: 'Saldo Utama (Gaji / Rekening Utama)',
    balance: 15500000,
    icon: 'Wallet',
    color: '#3B82F6',
    scopeCode: null
  },
  {
    id: 'acc-household',
    type: 'HOUSEHOLD_SUB',
    name: 'Sub-Saldo Rumah Tangga',
    balance: 4800000,
    icon: 'Home',
    color: '#10B981',
    scopeCode: 'HOUSEHOLD_EXPENSE'
  },
  {
    id: 'acc-personal',
    type: 'PERSONAL_SUB',
    name: 'Sub-Saldo Personal',
    balance: 2350000,
    icon: 'User',
    color: '#8B5CF6',
    scopeCode: 'PERSONAL_EXPENSE'
  }
];

const DEFAULT_CATEGORIES = [
  { id: 'cat-inc-1', scope: 'INCOME', name: 'Gaji Bulanan', icon: 'DollarSign', color: '#10B981' },
  { id: 'cat-inc-2', scope: 'INCOME', name: 'Bonus & TTR', icon: 'Award', color: '#059669' },
  { id: 'cat-inc-3', scope: 'INCOME', name: 'Investasi & Dividen', icon: 'TrendingUp', color: '#047857' },
  { id: 'cat-inc-4', scope: 'INCOME', name: 'Usaha Sampingan', icon: 'Briefcase', color: '#34D399' },
  { id: 'cat-house-1', scope: 'HOUSEHOLD_EXPENSE', name: 'Belanja Bulanan Supermarket', icon: 'ShoppingCart', color: '#EF4444' },
  { id: 'cat-house-2', scope: 'HOUSEHOLD_EXPENSE', name: 'Tagihan Listrik & Air (PLN/PDAM)', icon: 'Zap', color: '#DC2626' },
  { id: 'cat-house-3', scope: 'HOUSEHOLD_EXPENSE', name: 'Pendidikan & Uang Sekolah', icon: 'BookOpen', color: '#B91C1C' },
  { id: 'cat-house-4', scope: 'HOUSEHOLD_EXPENSE', name: 'Kesehatan & Obat-obatan', icon: 'Activity', color: '#F87171' },
  { id: 'cat-house-5', scope: 'HOUSEHOLD_EXPENSE', name: 'Perawatan & Renovasi Rumah', icon: 'Hammer', color: '#991B1B' },
  { id: 'cat-pers-1', scope: 'PERSONAL_EXPENSE', name: 'Hiburan, Film & Game', icon: 'Gamepad2', color: '#8B5CF6' },
  { id: 'cat-pers-2', scope: 'PERSONAL_EXPENSE', name: 'Hobi & Olahraga', icon: 'Dumbbell', color: '#7C3AED' },
  { id: 'cat-pers-3', scope: 'PERSONAL_EXPENSE', name: 'Pakaian & Fashion Lifestyle', icon: 'ShoppingBag', color: '#6D28D9' },
  { id: 'cat-pers-4', scope: 'PERSONAL_EXPENSE', name: 'Jajan & Kopi / Makan Luar', icon: 'Coffee', color: '#A78BFA' }
];

const DEFAULT_TRANSACTIONS = [
  {
    id: 'trx-1',
    type: 'INCOME',
    accountId: 'acc-primary',
    categoryId: 'cat-inc-1',
    categoryName: 'Gaji Bulanan',
    amount: 22000000,
    date: '2026-09-01',
    description: 'Penerimaan Gaji Bulanan September'
  },
  {
    id: 'trx-2',
    type: 'ALLOCATION',
    fromAccountId: 'acc-primary',
    toAccountId: 'acc-household',
    amount: 6000000,
    date: '2026-09-02',
    description: 'Alokasi Dana Sub-Saldo Rumah Tangga'
  },
  {
    id: 'trx-3',
    type: 'ALLOCATION',
    fromAccountId: 'acc-primary',
    toAccountId: 'acc-personal',
    amount: 3000000,
    date: '2026-09-02',
    description: 'Alokasi Dana Sub-Saldo Personal'
  },
  {
    id: 'trx-4',
    type: 'EXPENSE',
    accountId: 'acc-household',
    categoryId: 'cat-house-1',
    categoryName: 'Belanja Bulanan Supermarket',
    amount: 850000,
    date: '2026-09-03',
    description: 'Belanja stok makanan mingguan di Hypermart'
  },
  {
    id: 'trx-5',
    type: 'EXPENSE',
    accountId: 'acc-household',
    categoryId: 'cat-house-2',
    categoryName: 'Tagihan Listrik & Air (PLN/PDAM)',
    amount: 350000,
    date: '2026-09-03',
    description: 'Bayar token PLN & tagihan PDAM'
  },
  {
    id: 'trx-6',
    type: 'EXPENSE',
    accountId: 'acc-personal',
    categoryId: 'cat-pers-4',
    categoryName: 'Jajan & Kopi / Makan Luar',
    amount: 150000,
    date: '2026-09-04',
    description: 'Kopi & makan siang bersama tim kerja'
  },
  {
    id: 'trx-7',
    type: 'EXPENSE',
    accountId: 'acc-personal',
    categoryId: 'cat-pers-1',
    categoryName: 'Hiburan, Film & Game',
    amount: 500000,
    date: '2026-09-04',
    description: 'Langganan streaming & tiket bioskop weekend'
  },
  {
    id: 'trx-8',
    type: 'EXPENSE',
    accountId: 'acc-primary',
    categoryId: 'cat-house-3',
    categoryName: 'Pendidikan & Uang Sekolah',
    amount: 500000,
    date: '2026-09-04',
    description: 'Pembayaran buku sekolah anak (Langsung dari Saldo Utama)'
  }
];

export const storageService = {
  init(userEmail) {
    const accKey = getStorageKey('accounts', userEmail);
    const catKey = getStorageKey('categories', userEmail);
    const trxKey = getStorageKey('transactions', userEmail);

    if (!localStorage.getItem(accKey)) {
      localStorage.setItem(accKey, JSON.stringify(DEFAULT_ACCOUNTS));
    }
    if (!localStorage.getItem(catKey)) {
      localStorage.setItem(catKey, JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem(trxKey)) {
      localStorage.setItem(trxKey, JSON.stringify(DEFAULT_TRANSACTIONS));
    }
  },

  getAccounts(userEmail) {
    this.init(userEmail);
    const accKey = getStorageKey('accounts', userEmail);
    return JSON.parse(localStorage.getItem(accKey) || '[]');
  },

  updateAccounts(accounts, userEmail) {
    const accKey = getStorageKey('accounts', userEmail);
    localStorage.setItem(accKey, JSON.stringify(accounts));
  },

  getCategories(userEmail) {
    this.init(userEmail);
    const catKey = getStorageKey('categories', userEmail);
    return JSON.parse(localStorage.getItem(catKey) || '[]');
  },

  addCategory(category, userEmail) {
    const categories = this.getCategories(userEmail);
    const newCategory = {
      ...category,
      id: 'cat-custom-' + Date.now()
    };
    categories.push(newCategory);
    const catKey = getStorageKey('categories', userEmail);
    localStorage.setItem(catKey, JSON.stringify(categories));
    return newCategory;
  },

  deleteCategory(id, userEmail) {
    let categories = this.getCategories(userEmail);
    categories = categories.filter(c => c.id !== id);
    const catKey = getStorageKey('categories', userEmail);
    localStorage.setItem(catKey, JSON.stringify(categories));
  },

  // Tambah Sub-Saldo / Pos baru. Setiap pos memiliki scopeCode (jenis pengeluaran) sendiri.
  addSubAccount(subAccountData, userEmail) {
    const accounts = this.getAccounts(userEmail);
    const name = String((subAccountData && subAccountData.name) || '').trim();
    if (!name) {
      throw new Error('Nama pos / sub-saldo tidak boleh kosong.');
    }

    const timestamp = Date.now();
    const base = slugify(name) || 'pos';
    const newAccount = {
      id: `acc-${base}-${timestamp}`,
      type: 'CUSTOM_SUB',
      name: `Sub-Saldo ${name}`,
      balance: 0,
      icon: (subAccountData && subAccountData.icon) || 'Wallet',
      color: (subAccountData && subAccountData.color) || '#8B5CF6',
      scopeCode: `SCOPE_${timestamp}`
    };

    accounts.push(newAccount);
    const accKey = getStorageKey('accounts', userEmail);
    localStorage.setItem(accKey, JSON.stringify(accounts));
    return newAccount;
  },

  // Hapus Sub-Saldo / Pos dengan syarat aman:
  // saldo harus Rp 0 dan tidak ada transaksi yang memakainya.
  // Kategori milik pos (scope) ikut terhapus.
  deleteSubAccount(accId, userEmail) {
    let accounts = this.getAccounts(userEmail);
    const transactions = this.getTransactions(userEmail);
    const account = accounts.find(a => a.id === accId);

    if (!account) throw new Error('Sub-Saldo tidak ditemukan.');
    if (account.type === 'PRIMARY') throw new Error('Saldo Utama tidak dapat dihapus.');
    if (Number(account.balance) !== 0) {
      throw new Error('Sub-Saldo masih memiliki saldo. Kosongkan dulu sebelum menghapus.');
    }

    const isUsed = transactions.some(t =>
      t.accountId === accId || t.fromAccountId === accId || t.toAccountId === accId
    );
    if (isUsed) {
      throw new Error('Sub-Saldo masih dipakai oleh transaksi. Tidak dapat dihapus.');
    }

    // Cascade hapus kategori yang ber-scope milik pos ini
    const scope = account.scopeCode;
    if (scope) {
      let categories = this.getCategories(userEmail);
      categories = categories.filter(c => c.scope !== scope);
      const catKey = getStorageKey('categories', userEmail);
      localStorage.setItem(catKey, JSON.stringify(categories));
    }

    accounts = accounts.filter(a => a.id !== accId);
    const accKey = getStorageKey('accounts', userEmail);
    localStorage.setItem(accKey, JSON.stringify(accounts));
    return true;
  },

  getTransactions(userEmail) {
    this.init(userEmail);
    const trxKey = getStorageKey('transactions', userEmail);
    return JSON.parse(localStorage.getItem(trxKey) || '[]');
  },

  addTransaction(transaction, userEmail) {
    const transactions = this.getTransactions(userEmail);
    const accounts = this.getAccounts(userEmail);

    const newTrx = {
      ...transaction,
      id: 'trx-' + Date.now()
    };

    const accountIndex = accounts.findIndex(a => a.id === transaction.accountId);
    if (accountIndex !== -1) {
      if (transaction.type === 'INCOME') {
        accounts[accountIndex].balance += Number(transaction.amount);
      } else if (transaction.type === 'EXPENSE') {
        accounts[accountIndex].balance -= Number(transaction.amount);
      }
    }

    transactions.unshift(newTrx);
    const trxKey = getStorageKey('transactions', userEmail);
    localStorage.setItem(trxKey, JSON.stringify(transactions));
    this.updateAccounts(accounts, userEmail);
    return newTrx;
  },

  allocateBalance({ fromAccountId, toAccountId, amount, description, date }, userEmail) {
    const transactions = this.getTransactions(userEmail);
    const accounts = this.getAccounts(userEmail);

    const fromAccIndex = accounts.findIndex(a => a.id === fromAccountId);
    const toAccIndex = accounts.findIndex(a => a.id === toAccountId);

    if (fromAccIndex === -1 || toAccIndex === -1) {
      throw new Error('Akun saldo asal atau tujuan tidak ditemukan.');
    }

    const numAmount = Number(amount);
    if (accounts[fromAccIndex].balance < numAmount) {
      throw new Error('Saldo Utama tidak mencukupi untuk melakukan alokasi dana.');
    }

    accounts[fromAccIndex].balance -= numAmount;
    accounts[toAccIndex].balance += numAmount;

    const allocationTrx = {
      id: 'trx-alloc-' + Date.now(),
      type: 'ALLOCATION',
      fromAccountId,
      toAccountId,
      amount: numAmount,
      date: date || new Date().toISOString().split('T')[0],
      description: description || `Alokasi Saldo ke ${accounts[toAccIndex].name}`
    };

    transactions.unshift(allocationTrx);
    const trxKey = getStorageKey('transactions', userEmail);
    localStorage.setItem(trxKey, JSON.stringify(transactions));
    this.updateAccounts(accounts, userEmail);
    return allocationTrx;
  },

  deleteTransaction(id, userEmail) {
    let transactions = this.getTransactions(userEmail);
    const accounts = this.getAccounts(userEmail);
    const trx = transactions.find(t => t.id === id);

    if (!trx) return;

    if (trx.type === 'INCOME') {
      const accIndex = accounts.findIndex(a => a.id === trx.accountId);
      if (accIndex !== -1) accounts[accIndex].balance -= Number(trx.amount);
    } else if (trx.type === 'EXPENSE') {
      const accIndex = accounts.findIndex(a => a.id === trx.accountId);
      if (accIndex !== -1) accounts[accIndex].balance += Number(trx.amount);
    } else if (trx.type === 'ALLOCATION') {
      const fromIndex = accounts.findIndex(a => a.id === trx.fromAccountId);
      const toIndex = accounts.findIndex(a => a.id === trx.toAccountId);
      if (fromIndex !== -1) accounts[fromIndex].balance += Number(trx.amount);
      if (toIndex !== -1) accounts[toIndex].balance -= Number(trx.amount);
    }

    transactions = transactions.filter(t => t.id !== id);
    const trxKey = getStorageKey('transactions', userEmail);
    localStorage.setItem(trxKey, JSON.stringify(transactions));
    this.updateAccounts(accounts, userEmail);
  },

  // Edit/Update an existing transaction (reverse old, apply new)
  editTransaction(id, updatedData, userEmail) {
    // Strategy: delete the old transaction (reverses balance), then add new one
    this.deleteTransaction(id, userEmail);

    const transactions = this.getTransactions(userEmail);
    const accounts = this.getAccounts(userEmail);

    const newTrx = {
      ...updatedData,
      id: id, // preserve original ID
    };

    // Apply the new transaction's balance effect
    const accountIndex = accounts.findIndex(a => a.id === updatedData.accountId);
    if (accountIndex !== -1) {
      if (updatedData.type === 'INCOME') {
        accounts[accountIndex].balance += Number(updatedData.amount);
      } else if (updatedData.type === 'EXPENSE') {
        accounts[accountIndex].balance -= Number(updatedData.amount);
      }
    }

    // Insert at the same sorted position (push to end of array, sort later by date)
    transactions.push(newTrx);
    // Re-sort by date descending (newest first)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date) || b.id.localeCompare(a.id));

    const trxKey = getStorageKey('transactions', userEmail);
    localStorage.setItem(trxKey, JSON.stringify(transactions));
    this.updateAccounts(accounts, userEmail);
    return newTrx;
  },

  // Export Data JSON for device-to-device transfer
  exportData(userEmail) {
    const data = {
      userEmail,
      exportedAt: new Date().toISOString(),
      accounts: this.getAccounts(userEmail),
      categories: this.getCategories(userEmail),
      transactions: this.getTransactions(userEmail)
    };

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financecraft_backup_${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Import Data JSON
  importData(jsonData, userEmail) {
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (!parsed.accounts || !parsed.categories || !parsed.transactions) {
        throw new Error('Format file JSON cadangan tidak valid.');
      }

      const accKey = getStorageKey('accounts', userEmail);
      const catKey = getStorageKey('categories', userEmail);
      const trxKey = getStorageKey('transactions', userEmail);

      localStorage.setItem(accKey, JSON.stringify(parsed.accounts));
      localStorage.setItem(catKey, JSON.stringify(parsed.categories));
      localStorage.setItem(trxKey, JSON.stringify(parsed.transactions));
      return true;
    } catch (e) {
      throw new Error('Gagal mengimpor data: ' + e.message);
    }
  },

  // --------------------------------------------------------------------------
  // HYBRID ASYNC DISPATCHERS (Supabase PostgreSQL / LocalStorage Fallback)
  // --------------------------------------------------------------------------
  async getAccountsAsync(userEmail) {
    if (isSupabaseConfigured()) {
      return await supabaseService.getAccounts(userEmail);
    }
    return this.getAccounts(userEmail);
  },

  async getCategoriesAsync(userEmail) {
    if (isSupabaseConfigured()) {
      return await supabaseService.getCategories(userEmail);
    }
    return this.getCategories(userEmail);
  },

  async getTransactionsAsync(userEmail) {
    if (isSupabaseConfigured()) {
      return await supabaseService.getTransactions(userEmail);
    }
    return this.getTransactions(userEmail);
  },

  async addTransactionAsync(trxData, userEmail) {
    if (isSupabaseConfigured()) {
      return await supabaseService.addTransaction(trxData, userEmail);
    }
    return this.addTransaction(trxData, userEmail);
  },

  async editTransactionAsync(trxId, updatedData, userEmail) {
    if (isSupabaseConfigured()) {
      return await supabaseService.editTransaction(trxId, updatedData, userEmail);
    }
    return this.editTransaction(trxId, updatedData, userEmail);
  },

  async deleteTransactionAsync(trxId, userEmail) {
    if (isSupabaseConfigured()) {
      return await supabaseService.deleteTransaction(trxId, userEmail);
    }
    return this.deleteTransaction(trxId, userEmail);
  },

  async allocateBalanceAsync(allocationData, userEmail) {
    if (isSupabaseConfigured()) {
      return await supabaseService.allocateBalance(allocationData, userEmail);
    }
    return this.allocateBalance(allocationData, userEmail);
  },

  async addCategoryAsync(catData, userEmail) {
    if (isSupabaseConfigured()) {
      return await supabaseService.addCategory(catData, userEmail);
    }
    return this.addCategory(catData, userEmail);
  },

  async deleteCategoryAsync(catId, userEmail) {
    if (isSupabaseConfigured()) {
      return await supabaseService.deleteCategory(catId, userEmail);
    }
    return this.deleteCategory(catId, userEmail);
  },

  async addSubAccountAsync(subAccountData, userEmail) {
    if (isSupabaseConfigured()) {
      return await supabaseService.addAccount(subAccountData, userEmail);
    }
    return this.addSubAccount(subAccountData, userEmail);
  },

  async deleteSubAccountAsync(accId, userEmail) {
    if (isSupabaseConfigured()) {
      return await supabaseService.deleteAccount(accId, userEmail);
    }
    return this.deleteSubAccount(accId, userEmail);
  }
};

