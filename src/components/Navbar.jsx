import React, { useState } from 'react';
import { Wallet, PieChart, Tag, Sun, Moon, ArrowRightLeft, ShieldCheck, LogOut, BookOpen, Users, Download, Upload, Database } from 'lucide-react';
import { storageService } from '../services/storageService';
import { isSupabaseConfigured } from '../services/supabaseClient';


export const Navbar = ({ activeTab, setActiveTab, accounts, theme, toggleTheme, onOpenAllocation, currentUser, onLogout, onOpenGuide, onOpenSupabaseConfig }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const isSuperAdmin = currentUser && currentUser.role === 'SUPER_ADMIN';
  const isCloudActive = isSupabaseConfigured();

  return (
    <>
      <nav className="navbar">
        <div className="brand-logo">
          <ShieldCheck size={28} color="#3B82F6" />
          <span>FinanceCraft</span>
        </div>

        <div className="nav-links desktop-nav-links">
          <button
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <PieChart size={18} />
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <Wallet size={18} />
            <span>Laporan Detail</span>
          </button>
          <button
            className={`nav-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <Tag size={18} />
            <span>Kelola Kategori</span>
          </button>

          {isSuperAdmin && (
            <button
              className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
              style={{ position: 'relative' }}
            >
              <Users size={18} color="#8B5CF6" />
              <span style={{ color: activeTab === 'users' ? '#ffffff' : '#8B5CF6' }}>Kelola User</span>
            </button>
          )}
        </div>

        <div className="header-actions">
          {/* Database Connection Status Button */}
          <button
            className="btn btn-outline"
            onClick={onOpenSupabaseConfig}
            style={{
              padding: '0.45rem 0.8rem',
              fontSize: '0.8rem',
              borderColor: isCloudActive ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)',
              background: isCloudActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
              color: isCloudActive ? '#10B981' : 'var(--text-secondary)'
            }}
            title="Klik untuk Pengaturan Koneksi Supabase PostgreSQL"
          >
            <Database size={15} color={isCloudActive ? '#10B981' : '#F59E0B'} />
            <span className="btn-text-responsive">
              {isCloudActive ? 'Supabase DB' : 'Local Storage'}
            </span>
          </button>

          <button
            className="btn btn-outline desktop-only-btn"
            onClick={onOpenGuide}
            style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
            title="Buka Panduan Penggunaan & PDF"
          >
            <BookOpen size={16} color="#10B981" />
            <span>Panduan PDF</span>
          </button>

          <button
            className="btn btn-outline"
            onClick={onOpenAllocation}
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
            title="Alokasi Saldo Utama ke Sub-Saldo"
          >
            <ArrowRightLeft size={16} color="#3B82F6" />
            <span className="btn-text-responsive">Alokasi Saldo</span>
          </button>

          <button className="theme-toggle-btn" onClick={toggleTheme} title="Ganti Tema Dark/Light">
            {theme === 'dark' ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#3B82F6" />}
          </button>

          {/* User Profile Badge & Logout Menu */}
          {currentUser && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  color: 'var(--text-primary)'
                }}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=user'; }}
                />
                <span className="user-name-header" style={{ fontSize: '0.85rem', fontWeight: 600, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.name}
                </span>
              </button>

              {showProfileMenu && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '110%',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '14px',
                    padding: '1rem',
                    boxShadow: 'var(--shadow-md)',
                    width: '250px',
                    zIndex: 100
                  }}
                >
                  <div style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {currentUser.email}
                    </div>
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {isSuperAdmin ? (
                        <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', border: '1px solid rgba(139, 92, 246, 0.3)', fontSize: '0.68rem' }}>
                          <ShieldCheck size={12} /> Admin Utama
                        </span>
                      ) : (
                        <span className="badge badge-income" style={{ fontSize: '0.68rem' }}>
                          User Standard
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    className="btn btn-outline"
                    onClick={onOpenGuide}
                    style={{ width: '100%', justifyContent: 'flex-start', border: 'none', padding: '0.5rem', marginBottom: '0.25rem', fontSize: '0.82rem' }}
                  >
                    <BookOpen size={16} color="#10B981" /> Buku Panduan PDF
                  </button>

                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (currentUser) {
                        storageService.exportData(currentUser.email);
                      }
                    }}
                    style={{ width: '100%', justifyContent: 'flex-start', border: 'none', padding: '0.5rem', marginBottom: '0.25rem', fontSize: '0.82rem' }}
                  >
                    <Download size={16} color="#3B82F6" /> Ekspor Backup Data (JSON)
                  </button>

                  <label
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'flex-start', border: 'none', padding: '0.5rem', marginBottom: '0.25rem', fontSize: '0.82rem', cursor: 'pointer', display: 'flex' }}
                  >
                    <Upload size={16} color="#8B5CF6" /> Impor Restore Data (JSON)
                    <input
                      type="file"
                      accept=".json"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file && currentUser) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            try {
                              storageService.importData(event.target.result, currentUser.email);
                              alert('Data berhasil di-restore!');
                              window.location.reload();
                            } catch (err) {
                              alert(err.message);
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </label>

                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    style={{ width: '100%', justifyContent: 'flex-start', color: '#EF4444', border: 'none', padding: '0.5rem', fontSize: '0.82rem' }}
                  >
                    <LogOut size={16} /> Keluar (Logout)
                  </button>

                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar for Smartphone screens */}
      <div className="mobile-bottom-nav">
        <button
          className={`mobile-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <PieChart size={20} />
          <span>Dashboard</span>
        </button>

        <button
          className={`mobile-nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <Wallet size={20} />
          <span>Laporan</span>
        </button>

        <button
          className={`mobile-nav-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <Tag size={20} />
          <span>Kategori</span>
        </button>

        {isSuperAdmin && (
          <button
            className={`mobile-nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={20} color={activeTab === 'users' ? '#ffffff' : '#8B5CF6'} />
            <span style={{ color: activeTab === 'users' ? '#ffffff' : '#8B5CF6' }}>User Admin</span>
          </button>
        )}
      </div>
    </>
  );
};

