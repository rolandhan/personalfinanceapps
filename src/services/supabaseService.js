import { supabase } from './supabaseClient';

const DEFAULT_ACCOUNTS = [
  { id: 'acc-primary', type: 'PRIMARY', name: 'Saldo Utama (Gaji / Rekening Utama)', balance: 15500000, icon: 'Wallet' },
  { id: 'acc-household', type: 'HOUSEHOLD_SUB', name: 'Sub-Saldo Rumah Tangga', balance: 4800000, icon: 'Home' },
  { id: 'acc-personal', type: 'PERSONAL_SUB', name: 'Sub-Saldo Personal', balance: 2350000, icon: 'User' }
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
    account_id: 'acc-primary',
    category_id: 'cat-inc-1',
    category_name: 'Gaji Bulanan',
    amount: 22000000,
    date: '2026-09-01',
    description: 'Penerimaan Gaji Bulanan September'
  },
  {
    id: 'trx-2',
    type: 'ALLOCATION',
    from_account_id: 'acc-primary',
    to_account_id: 'acc-household',
    amount: 6000000,
    date: '2026-09-02',
    description: 'Alokasi Dana Sub-Saldo Rumah Tangga'
  },
  {
    id: 'trx-3',
    type: 'ALLOCATION',
    from_account_id: 'acc-primary',
    to_account_id: 'acc-personal',
    amount: 3000000,
    date: '2026-09-02',
    description: 'Alokasi Dana Sub-Saldo Personal'
  },
  {
    id: 'trx-4',
    type: 'EXPENSE',
    account_id: 'acc-household',
    category_id: 'cat-house-1',
    category_name: 'Belanja Bulanan Supermarket',
    amount: 1200000,
    date: '2026-09-03',
    description: 'Belanja Sembako Supermarket'
  },
  {
    id: 'trx-5',
    type: 'EXPENSE',
    account_id: 'acc-personal',
    category_id: 'cat-pers-4',
    category_name: 'Jajan & Kopi / Makan Luar',
    amount: 650000,
    date: '2026-09-04',
    description: 'Nongkrong & Kopi Minggu Pertama'
  }
];

export const supabaseService = {
  // Ensure initial user data exists in Supabase PostgreSQL
  async ensureUserData(userEmail) {
    if (!supabase || !userEmail) return;

    try {
      // 1. Check if user accounts exist
      const { data: accounts, error: accError } = await supabase
        .from('accounts')
        .select('id')
        .eq('user_email', userEmail);

      if (accError) console.error('Supabase check accounts error:', accError);

      if (!accounts || accounts.length === 0) {
        // Seed default accounts
        const seedAccounts = DEFAULT_ACCOUNTS.map(a => ({
          ...a,
          user_email: userEmail,
          updated_at: new Date().toISOString()
        }));
        await supabase.from('accounts').insert(seedAccounts);
      }

      // 2. Check categories
      const { data: categories } = await supabase
        .from('categories')
        .select('id')
        .eq('user_email', userEmail);

      if (!categories || categories.length === 0) {
        const seedCategories = DEFAULT_CATEGORIES.map(c => ({
          ...c,
          user_email: userEmail
        }));
        await supabase.from('categories').insert(seedCategories);
      }

      // 3. Check transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('id')
        .eq('user_email', userEmail);

      if (!transactions || transactions.length === 0) {
        const seedTransactions = DEFAULT_TRANSACTIONS.map(t => ({
          ...t,
          user_email: userEmail
        }));
        await supabase.from('transactions').insert(seedTransactions);
      }
    } catch (err) {
      console.error('Error in ensureUserData Supabase:', err);
    }
  },

  // Fetch Accounts
  async getAccounts(userEmail) {
    if (!supabase) return [];
    await this.ensureUserData(userEmail);

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_email', userEmail);

    if (error) {
      console.error('Error fetching accounts:', error);
      return [];
    }

    return (data || []).map(a => ({
      id: a.id,
      type: a.type,
      name: a.name,
      balance: Number(a.balance),
      icon: a.icon
    }));
  },

  // Fetch Categories
  async getCategories(userEmail) {
    if (!supabase) return [];
    await this.ensureUserData(userEmail);

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_email', userEmail);

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data || [];
  },

  // Fetch Transactions
  async getTransactions(userEmail) {
    if (!supabase) return [];
    await this.ensureUserData(userEmail);

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_email', userEmail)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }

    return (data || []).map(t => ({
      id: t.id,
      type: t.type,
      accountId: t.account_id,
      fromAccountId: t.from_account_id,
      toAccountId: t.to_account_id,
      categoryId: t.category_id,
      categoryName: t.category_name,
      amount: Number(t.amount),
      date: t.date,
      description: t.description
    }));
  },

  // Add Transaction
  async addTransaction(trxData, userEmail) {
    if (!supabase || !userEmail) return null;

    const newId = `trx-${Date.now()}`;
    const newTrx = {
      id: newId,
      user_email: userEmail,
      type: trxData.type,
      account_id: trxData.accountId,
      category_id: trxData.categoryId,
      category_name: trxData.categoryName,
      amount: Number(trxData.amount),
      date: trxData.date || new Date().toISOString().split('T')[0],
      description: trxData.description
    };

    // Insert transaction
    const { error: trxError } = await supabase.from('transactions').insert(newTrx);
    if (trxError) throw trxError;

    // Update account balance
    const accounts = await this.getAccounts(userEmail);
    const targetAcc = accounts.find(a => a.id === trxData.accountId);
    if (targetAcc) {
      let newBalance = targetAcc.balance;
      if (trxData.type === 'INCOME') newBalance += Number(trxData.amount);
      if (trxData.type === 'EXPENSE') newBalance -= Number(trxData.amount);

      await supabase
        .from('accounts')
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq('id', targetAcc.id)
        .eq('user_email', userEmail);
    }

    return newTrx;
  },

  // Edit Transaction
  async editTransaction(trxId, updatedData, userEmail) {
    if (!supabase || !userEmail) return null;

    // Fetch existing transaction
    const { data: existingList } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', trxId)
      .eq('user_email', userEmail);

    const oldTrx = existingList && existingList[0];
    if (oldTrx) {
      // Revert old transaction balance impact
      const accounts = await this.getAccounts(userEmail);
      const oldAcc = accounts.find(a => a.id === oldTrx.account_id);
      if (oldAcc) {
        let revertedBal = oldAcc.balance;
        if (oldTrx.type === 'INCOME') revertedBal -= Number(oldTrx.amount);
        if (oldTrx.type === 'EXPENSE') revertedBal += Number(oldTrx.amount);

        await supabase
          .from('accounts')
          .update({ balance: revertedBal, updated_at: new Date().toISOString() })
          .eq('id', oldAcc.id)
          .eq('user_email', userEmail);
      }
    }

    // Update transaction record
    const updatedPayload = {
      type: updatedData.type,
      account_id: updatedData.accountId,
      category_id: updatedData.categoryId,
      category_name: updatedData.categoryName,
      amount: Number(updatedData.amount),
      date: updatedData.date,
      description: updatedData.description
    };

    await supabase
      .from('transactions')
      .update(updatedPayload)
      .eq('id', trxId)
      .eq('user_email', userEmail);

    // Apply new transaction balance impact
    const accounts = await this.getAccounts(userEmail);
    const targetAcc = accounts.find(a => a.id === updatedData.accountId);
    if (targetAcc) {
      let newBal = targetAcc.balance;
      if (updatedData.type === 'INCOME') newBal += Number(updatedData.amount);
      if (updatedData.type === 'EXPENSE') newBal -= Number(updatedData.amount);

      await supabase
        .from('accounts')
        .update({ balance: newBal, updated_at: new Date().toISOString() })
        .eq('id', targetAcc.id)
        .eq('user_email', userEmail);
    }
  },

  // Delete Transaction
  async deleteTransaction(trxId, userEmail) {
    if (!supabase || !userEmail) return;

    const { data: existingList } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', trxId)
      .eq('user_email', userEmail);

    const targetTrx = existingList && existingList[0];
    if (!targetTrx) return;

    const accounts = await this.getAccounts(userEmail);

    if (targetTrx.type === 'ALLOCATION') {
      const fromAcc = accounts.find(a => a.id === targetTrx.from_account_id);
      const toAcc = accounts.find(a => a.id === targetTrx.to_account_id);

      if (fromAcc) {
        await supabase
          .from('accounts')
          .update({ balance: fromAcc.balance + Number(targetTrx.amount), updated_at: new Date().toISOString() })
          .eq('id', fromAcc.id)
          .eq('user_email', userEmail);
      }
      if (toAcc) {
        await supabase
          .from('accounts')
          .update({ balance: Math.max(0, toAcc.balance - Number(targetTrx.amount)), updated_at: new Date().toISOString() })
          .eq('id', toAcc.id)
          .eq('user_email', userEmail);
      }
    } else {
      const acc = accounts.find(a => a.id === targetTrx.account_id);
      if (acc) {
        let restoredBal = acc.balance;
        if (targetTrx.type === 'INCOME') restoredBal -= Number(targetTrx.amount);
        if (targetTrx.type === 'EXPENSE') restoredBal += Number(targetTrx.amount);

        await supabase
          .from('accounts')
          .update({ balance: Math.max(0, restoredBal), updated_at: new Date().toISOString() })
          .eq('id', acc.id)
          .eq('user_email', userEmail);
      }
    }

    await supabase.from('transactions').delete().eq('id', trxId).eq('user_email', userEmail);
  },

  // Allocate Balance
  async allocateBalance(allocationData, userEmail) {
    if (!supabase || !userEmail) return;

    const { fromAccountId, toAccountId, amount, notes } = allocationData;
    const numAmount = Number(amount);

    const accounts = await this.getAccounts(userEmail);
    const fromAcc = accounts.find(a => a.id === fromAccountId);
    const toAcc = accounts.find(a => a.id === toAccountId);

    if (!fromAcc || !toAcc || fromAcc.balance < numAmount) {
      throw new Error('Saldo tidak mencukupi untuk dialokasikan.');
    }

    // Deduct from source
    await supabase
      .from('accounts')
      .update({ balance: fromAcc.balance - numAmount, updated_at: new Date().toISOString() })
      .eq('id', fromAcc.id)
      .eq('user_email', userEmail);

    // Add to target
    await supabase
      .from('accounts')
      .update({ balance: toAcc.balance + numAmount, updated_at: new Date().toISOString() })
      .eq('id', toAcc.id)
      .eq('user_email', userEmail);

    // Record allocation transaction
    const newTrx = {
      id: `trx-${Date.now()}`,
      user_email: userEmail,
      type: 'ALLOCATION',
      from_account_id: fromAccountId,
      to_account_id: toAccountId,
      amount: numAmount,
      date: new Date().toISOString().split('T')[0],
      description: notes || `Alokasi Saldo dari ${fromAcc.name} ke ${toAcc.name}`
    };

    await supabase.from('transactions').insert(newTrx);
  },

  // Add Category
  async addCategory(catData, userEmail) {
    if (!supabase || !userEmail) return;

    const newCat = {
      id: `cat-custom-${Date.now()}`,
      user_email: userEmail,
      scope: catData.scope,
      name: catData.name,
      icon: catData.icon || 'Tag',
      color: catData.color || '#3B82F6'
    };

    await supabase.from('categories').insert(newCat);
  },

  // Delete Category
  async deleteCategory(catId, userEmail) {
    if (!supabase || !userEmail) return;
    await supabase.from('categories').delete().eq('id', catId).eq('user_email', userEmail);
  }
};
