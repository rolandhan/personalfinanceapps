// Utilitas "Pos / Sub-Saldo & Jenis Pengeluaran (scope)" dinamis.
// Sebelumnya aplikasi meng-hardcode 2 jenis pengeluaran (RT & Personal) + INCOME.
// Kini 1 sub-akun (pos) = 1 scope/jenis pengeluaran, sehingga pengguna bisa
// menambah pos baru sesuai kebutuhan (Bisnis, Anak, dst).

export const INCOME_SCOPE = 'INCOME';

// Meta bawaan utk 3 akun default. Dipakai sbg fallback bila data lama
// (LocalStorage/DB) belum punya field color / scopeCode.
const BUILTIN_ACCOUNTS = {
  'acc-primary': { type: 'PRIMARY', label: 'Saldo Utama', color: '#3B82F6', icon: 'Wallet' },
  'acc-household': { type: 'HOUSEHOLD_SUB', scope: 'HOUSEHOLD_EXPENSE', label: 'Rumah Tangga', color: '#10B981', icon: 'Home', footer: 'Pos Belanja & Operasional RT' },
  'acc-personal': { type: 'PERSONAL_SUB', scope: 'PERSONAL_EXPENSE', label: 'Personal', color: '#8B5CF6', icon: 'User', footer: 'Pos Hiburan, Hobi & Lifestyle' }
};

// Palet warna dipakai otomatis bila pengguna tidak memilih warna saat membuat pos.
export const POS_PALETTE = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#14B8A6'];

export const slugify = (text = '') =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// ─── Predikat & aksesor akun ──────────────────────────────────────────────

export const isSubAccount = (acc) => !!acc && !!acc.type && acc.type !== 'PRIMARY';

export const getSubAccounts = (accounts = []) => (accounts || []).filter(isSubAccount);

export const getPrimaryAccount = (accounts = []) =>
  (accounts || []).find((a) => a.type === 'PRIMARY') || (accounts || [])[0] || null;

export const getAccountColor = (acc) =>
  (acc && acc.color) || (acc && BUILTIN_ACCOUNTS[acc.id] && BUILTIN_ACCOUNTS[acc.id].color) || '#8B5CF6';

export const getAccountIcon = (acc) =>
  (acc && acc.icon) || (acc && BUILTIN_ACCOUNTS[acc.id] && BUILTIN_ACCOUNTS[acc.id].icon) || 'Wallet';

export const getAccountFooter = (acc) => {
  if (!acc) return '';
  const builtin = BUILTIN_ACCOUNTS[acc.id];
  if (builtin && builtin.footer) return builtin.footer;
  return 'Pos sub-saldo tersendiri untuk alokasi & pengeluaran';
};

// Label pendek sebuah pos, mis. "Sub-Saldo Bisnis" → "Bisnis".
export const getAccountShortLabel = (acc) => {
  if (!acc) return '';
  const builtin = BUILTIN_ACCOUNTS[acc.id];
  if (builtin && builtin.label) return builtin.label;
  const name = String(acc.name || acc.label || '');
  return name.replace(/^Sub-?Saldo\s+/i, '').replace(/^Sub\s+/i, '').trim() || name || 'Sub-Saldo';
};

// Kode jenis-pengeluaran milik sebuah akun (sub-akun), null utk PRIMARY.
export const getAccountScopeCode = (acc) => {
  if (!acc) return null;
  if (acc.scopeCode) return acc.scopeCode;
  const builtin = BUILTIN_ACCOUNTS[acc.id];
  return (builtin && builtin.scope) || null;
};

// ─── Meta scope (untuk badge, statistik, dsb.) ────────────────────────────

export const getScopeMeta = (scope, accounts = []) => {
  if (!scope) return { label: 'Tanpa Jenis', color: '#64748B' };
  if (scope === INCOME_SCOPE) return { label: 'Pemasukan', emoji: '💰', color: '#10B981' };
  if (scope === 'HOUSEHOLD_EXPENSE') return { label: 'Rumah Tangga', emoji: '🏠', color: '#10B981' };
  if (scope === 'PERSONAL_EXPENSE') return { label: 'Personal', emoji: '👤', color: '#8B5CF6' };

  const owner = (accounts || []).find((a) => getAccountScopeCode(a) === scope);
  if (owner) {
    return { label: getAccountShortLabel(owner), color: getAccountColor(owner) };
  }
  return { label: String(scope), color: '#64748B' };
};

// Semua scope selain INCOME adalah scope pengeluaran.
export const isExpenseScope = (scope) => scope !== INCOME_SCOPE;

// Sufiks pendek utk opsi kategori di dropdown transaksi,
// mis. "🏠 Rumah Tangga", "👤 Personal", "💰 Pemasukan", atau label pos kustom.
export const getScopeOptionSuffix = (scope, accounts = []) => {
  if (scope === INCOME_SCOPE) return '💰 Pemasukan';
  if (scope === 'HOUSEHOLD_EXPENSE') return '🏠 Rumah Tangga';
  if (scope === 'PERSONAL_EXPENSE') return '👤 Personal';
  const meta = getScopeMeta(scope, accounts);
  return meta.label || scope;
};
