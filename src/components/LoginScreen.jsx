import React, { useEffect, useState } from 'react';
import { ShieldCheck, Wallet, Lock, LogIn, Settings, Key, ShieldAlert } from 'lucide-react';
import { authService, DEFAULT_GOOGLE_CLIENT_ID } from '../services/authService';

export const LoginScreen = ({ onLoginSuccess }) => {
  const [clientId, setClientId] = useState(() => localStorage.getItem('fc_google_client_id') || DEFAULT_GOOGLE_CLIENT_ID);
  const [showConfig, setShowConfig] = useState(false);
  const [loginTab, setLoginTab] = useState('credentials'); // 'credentials', 'google'

  // Credentials State
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    authService.loadGoogleScript(() => {
      if (window.google && window.google.accounts) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
              try {
                const user = authService.handleGoogleCredential(response);
                onLoginSuccess(user);
              } catch (err) {
                alert(err.message);
              }
            }
          });

          const btnContainer = document.getElementById('googleSignInBtn');
          if (btnContainer) {
            btnContainer.innerHTML = '';
            window.google.accounts.id.renderButton(btnContainer, {
              theme: 'filled_blue',
              size: 'large',
              width: '280',
              text: 'signin_with',
              shape: 'pill'
            });
          }
        } catch (e) {
          console.warn('Google Identity initialization notice:', e);
        }
      }
    });
  }, [clientId, onLoginSuccess, loginTab]);

  const handleSaveClientId = (e) => {
    e.preventDefault();
    localStorage.setItem('fc_google_client_id', clientId);
    alert('Google Client ID berhasil disimpan.');
    window.location.reload();
  };

  const handleCredentialLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const user = authService.loginWithCredentials(emailInput, passwordInput);
      onLoginSuccess(user);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-wrapper">
        {/* Left Column: Product Branding */}
        <div className="login-brand-col">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <ShieldCheck size={38} color="#3B82F6" />
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              FinanceCraft
            </h1>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Kelola Keuangan Multi-Saldo & Multi-User Dalam Satu Aplikasi.
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            Solusi finansial cerdas dengan fitur **Admin Utama (Super Admin)** untuk mengelola akun pengguna, alokasi saldo otomatis, dan analitik laporan komprehensif.
          </p>

          <div className="login-features-grid">
            <div className="glass-card" style={{ padding: '1rem' }}>
              <ShieldAlert size={24} color="#8B5CF6" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>Akses Multi-User</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Admin Utama dapat membuat & mengelola akun anggota keluarga / tim.</div>
            </div>

            <div className="glass-card" style={{ padding: '1rem' }}>
              <Wallet size={24} color="#3B82F6" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>Sistem Multi-Saldo</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pos dana utama, operasional rumah tangga, & kebutuhan personal.</div>
            </div>
          </div>
        </div>

        {/* Right Column: Login Box */}
        <div className="glass-card login-box">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem'
              }}
            >
              <Lock size={24} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.25rem' }}>Selamat Datang</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Silakan masukan email dan password akun Anda.
            </p>
          </div>

          {/* Login Tabs */}
          <div className="login-tab-switcher">
            <button
              className={`login-tab-btn ${loginTab === 'credentials' ? 'active' : ''}`}
              onClick={() => { setErrorMsg(''); setLoginTab('credentials'); }}
            >
              <Key size={14} /> Password
            </button>
            <button
              className={`login-tab-btn ${loginTab === 'google' ? 'active' : ''}`}
              onClick={() => { setErrorMsg(''); setLoginTab('google'); }}
            >
              Google SSO
            </button>
          </div>

          {/* Credentials / Password Login Form */}
          {loginTab === 'credentials' && (
            <form onSubmit={handleCredentialLogin}>
              {errorMsg && (
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#EF4444', padding: '0.6rem 0.85rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.82rem' }}>
                  {errorMsg}
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">Email / Username Login</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Masukkan email Anda..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Password Akses</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Masukkan password Anda..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                <LogIn size={18} /> Masuk Akun
              </button>
            </form>
          )}

          {/* Official Google Button Tab */}
          {loginTab === 'google' && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Masuk aman menggunakan identitas Google OAuth 2.0.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', minHeight: '44px' }}>
                <div id="googleSignInBtn"></div>
              </div>
            </div>
          )}

          {/* Optional Google Client ID Config Drawer */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button
              className="nav-btn"
              onClick={() => setShowConfig(!showConfig)}
              style={{ fontSize: '0.78rem', color: 'var(--text-muted)', padding: '0.2rem' }}
            >
              <Settings size={14} /> {showConfig ? 'Sembunyikan Pengaturan Client ID' : 'Atur Custom Google Client ID'}
            </button>

            {showConfig && (
              <form onSubmit={handleSaveClientId} style={{ marginTop: '0.75rem', textAlign: 'left' }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Google OAuth 2.0 Client ID:</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ fontSize: '0.8rem', padding: '0.5rem', marginBottom: '0.5rem' }}
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="xxxx.apps.googleusercontent.com"
                  required
                />
                <button type="submit" className="btn btn-outline" style={{ width: '100%', padding: '0.4rem', fontSize: '0.78rem' }}>
                  Simpan Client ID
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
