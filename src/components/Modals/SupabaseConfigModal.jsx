import React, { useState, useEffect } from 'react';
import { X, Database, CheckCircle, AlertCircle, RefreshCw, Server } from 'lucide-react';
import { getSupabaseConfig, setSupabaseConfig, clearSupabaseConfig, testSupabaseConnection, isSupabaseConfigured } from '../../services/supabaseClient';

export const SupabaseConfigModal = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      setUrl(config.url);
      setKey(config.key);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    const result = await testSupabaseConnection(url, key);
    setTestResult(result);
    setIsTesting(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!url || !key) {
      alert('Silakan isi Supabase Project URL dan Anon Key terlebih dahulu.');
      return;
    }
    setSupabaseConfig(url, key);
  };

  const handleClear = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus konfigurasi Supabase dan kembali ke LocalStorage?')) {
      clearSupabaseConfig();
    }
  };

  const isConnected = isSupabaseConfigured();

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <div className="modal-title">
            <Database size={22} color="#10B981" />
            <span>Pengaturan Koneksi Basis Data Supabase</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body">
            {/* Status Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              background: isConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
              color: isConnected ? '#10B981' : '#F59E0B'
            }}>
              {isConnected ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <div style={{ fontSize: '0.88rem', fontWeight: 500 }}>
                {isConnected
                  ? 'Terhubung ke PostgreSQL Supabase (Persistensi Cloud Aktif)'
                  : 'Mode Offline (Menggunakan LocalStorage Perangkat)'}
              </div>
            </div>

            <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Hubungkan aplikasi dengan database <strong>Supabase (PostgreSQL)</strong> untuk mengaktifkan sinkronisasi multi-perangkat dan persiapan deployment di <strong>Vercel</strong>.
            </div>

            {/* Supabase URL */}
            <div className="form-group">
              <label className="form-label">Supabase Project URL *</label>
              <input
                type="text"
                className="form-control"
                placeholder="https://xyzxyz.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            {/* Supabase Anon Key */}
            <div className="form-group">
              <label className="form-label">Supabase Anon Key *</label>
              <textarea
                className="form-control"
                placeholder="eyJhY2Nlc3NfdG9rZW4iOi..."
                rows="3"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                required
              />
            </div>

            {/* Test connection results */}
            {testResult && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                background: testResult.success ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                color: testResult.success ? '#10B981' : '#EF4444',
                border: `1px solid ${testResult.success ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`
              }}>
                {testResult.message}
              </div>
            )}

            <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              💡 <strong>Petunjuk Skema Database:</strong> Pastikan Anda telah menjalankan query dari file <code>supabase_schema.sql</code> pada menu <strong>SQL Editor</strong> di Dashboard Supabase Anda.
            </div>
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              {isConnected && (
                <button type="button" className="btn btn-outline" onClick={handleClear} style={{ color: '#EF4444', borderColor: '#EF4444' }}>
                  Reset ke LocalStorage
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleTest}
                disabled={isTesting}
              >
                {isTesting ? <RefreshCw size={16} className="spin" /> : <Server size={16} />}
                {isTesting ? 'Menguji...' : 'Uji Koneksi'}
              </button>
              <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                Simpan & Hubungkan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
