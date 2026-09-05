import { createClient } from '@supabase/supabase-js';

// Supabase URL & Anon Key loaded from Vercel / Vite Environment Variables or LocalStorage override
export const getSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('fc_supabase_url') || '';
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('fc_supabase_anon_key') || '';
  return { url: url.trim(), key: key.trim() };
};

export const isSupabaseConfigured = () => {
  const { url, key } = getSupabaseConfig();
  return Boolean(url && key && url.startsWith('https://'));
};

const config = getSupabaseConfig();

export const supabase = isSupabaseConfigured()
  ? createClient(config.url, config.key)
  : null;

export const setSupabaseConfig = (url, key) => {
  if (url) localStorage.setItem('fc_supabase_url', url.trim());
  if (key) localStorage.setItem('fc_supabase_anon_key', key.trim());
  window.location.reload();
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('fc_supabase_url');
  localStorage.removeItem('fc_supabase_anon_key');
  window.location.reload();
};

export const testSupabaseConnection = async (testUrl, testKey) => {
  try {
    const url = testUrl || getSupabaseConfig().url;
    const key = testKey || getSupabaseConfig().key;
    if (!url || !key) return { success: false, message: 'URL atau Anon Key belum diisi.' };

    const client = createClient(url, key);
    const { data, error } = await client.from('accounts').select('count', { count: 'exact', head: true });
    
    if (error) {
      return { success: false, message: `Gagal terhubung: ${error.message}` };
    }
    return { success: true, message: 'Koneksi ke Supabase PostgreSQL berhasil!' };
  } catch (err) {
    return { success: false, message: `Error koneksi: ${err.message}` };
  }
};
