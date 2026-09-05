-- ==============================================================================
-- SKEMA BASIS DATA SUPABASE (POSTGRESQL) — FINANCECRAFT
-- Jalankan script ini di SQL Editor di Dashboard Supabase Anda:
-- Dashboard Supabase -> Project -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. TABEL USERS
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABEL ACCOUNTS (SALDO UTAMA & SUB-SALDO)
CREATE TABLE IF NOT EXISTS public.accounts (
    id VARCHAR(100) PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'PRIMARY', 'HOUSEHOLD_SUB', 'PERSONAL_SUB'
    name VARCHAR(150) NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 0,
    icon VARCHAR(50) DEFAULT 'Wallet',
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABEL CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id VARCHAR(100) PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    scope VARCHAR(50) NOT NULL, -- 'INCOME', 'HOUSEHOLD_EXPENSE', 'PERSONAL_EXPENSE'
    name VARCHAR(150) NOT NULL,
    icon VARCHAR(50) DEFAULT 'Tag',
    color VARCHAR(20) DEFAULT '#10B981',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABEL TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.transactions (
    id VARCHAR(100) PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'INCOME', 'EXPENSE', 'ALLOCATION'
    account_id VARCHAR(100),
    from_account_id VARCHAR(100),
    to_account_id VARCHAR(100),
    category_id VARCHAR(100),
    category_name VARCHAR(150),
    amount DECIMAL(15, 2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- INDEX UNTUK PERFORMA QUERY
CREATE INDEX IF NOT EXISTS idx_accounts_user ON public.accounts(user_email);
CREATE INDEX IF NOT EXISTS idx_categories_user ON public.categories(user_email);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.transactions(user_email);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date DESC);

-- HAPUS / AKTIFKAN ROW LEVEL SECURITY (RLS) UNTUK ANONYMOUS ACCESS / PERMISSION MODERASI
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS publik (mengizinkan read/write dengan API Anon Key)
DROP POLICY IF EXISTS "Public access users" ON public.users;
CREATE POLICY "Public access users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access accounts" ON public.accounts;
CREATE POLICY "Public access accounts" ON public.accounts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access categories" ON public.categories;
CREATE POLICY "Public access categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access transactions" ON public.transactions;
CREATE POLICY "Public access transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);

-- SEED DATA DEFAULTS UNTUK TESTING / AKUN ADMIN DEFAULTS
INSERT INTO public.users (email, name, role) 
VALUES ('rolandbianci@gmail.com', 'Admin Utama', 'SUPER_ADMIN')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.users (email, name, role) 
VALUES ('mbah.rah17@gmail.com', 'rahma', 'USER')
ON CONFLICT (email) DO NOTHING;
