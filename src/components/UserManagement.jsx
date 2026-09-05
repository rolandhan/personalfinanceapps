import React, { useState } from 'react';
import { Users, UserPlus, ShieldAlert, CheckCircle, XCircle, Trash2, Key, Search, UserCheck, ShieldCheck } from 'lucide-react';
import { authService } from '../services/authService';

export const UserManagement = ({ users, onRefreshUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});

  // Form State for Add User
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('USER');
  const [errorMsg, setErrorMsg] = useState('');

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === 'SUPER_ADMIN').length;
  const activeUsers = users.filter(u => u.status === 'ACTIVE').length;

  const togglePasswordVisibility = (id) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      authService.addUser({
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newRole
      });

      // Reset form
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setNewRole('USER');
      setIsAddModalOpen(false);
      onRefreshUsers();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleToggleStatus = (userId, currentName) => {
    try {
      authService.toggleUserStatus(userId);
      onRefreshUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteUser = (userId, currentName) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus akun pengguna "${currentName}"?`)) {
      try {
        authService.deleteUser(userId);
        onRefreshUsers();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="user-management-section">
      {/* Header & Stats Cards */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={28} color="#3B82F6" /> Kelola Pengguna (Admin Utama)
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Tambahkan dan kelola hak akses akun pengguna untuk membuka akses multi-user pada aplikasi.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => { setErrorMsg(''); setIsAddModalOpen(true); }}
          style={{ padding: '0.75rem 1.25rem' }}
        >
          <UserPlus size={18} /> Tambah User Baru
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="summary-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL USER</span>
            <Users size={22} color="#3B82F6" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem' }}>{totalUsers}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Terdaftar dalam sistem</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ADMIN UTAMA</span>
            <ShieldAlert size={22} color="#8B5CF6" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem', color: '#8B5CF6' }}>{adminUsers}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Super Admin Akses Penuh</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>AKUN AKTIF</span>
            <UserCheck size={22} color="#10B981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem', color: '#10B981' }}>{activeUsers}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dapat Login & Akses</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Cari nama atau email pengguna..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* User Table Card */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Pengguna</th>
                <th>Email / Username</th>
                <th>Password</th>
                <th>Peran / Role</th>
                <th>Status</th>
                <th>Tgl Dibuat</th>
                <th style={{ textAlign: 'right' }}>Aksi Admin</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    Tidak ada data pengguna yang sesuai pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.email)}`}
                          alt={u.name}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=user'; }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{u.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{u.email}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          {showPasswords[u.id] ? u.password : '••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(u.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
                          title="Lihat/Sembunyikan Password"
                        >
                          <Key size={14} />
                        </button>
                      </div>
                    </td>
                    <td>
                      {u.role === 'SUPER_ADMIN' ? (
                        <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                          <ShieldCheck size={12} /> Admin Utama
                        </span>
                      ) : (
                        <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                          User Standard
                        </span>
                      )}
                    </td>
                    <td>
                      {u.status === 'ACTIVE' ? (
                        <span className="badge badge-income">
                          <CheckCircle size={12} /> Aktif
                        </span>
                      ) : (
                        <span className="badge badge-expense">
                          <XCircle size={12} /> Nonaktif
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {u.createdAt || '2026-09-01'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          className={`btn ${u.status === 'ACTIVE' ? 'btn-outline' : 'btn-success'}`}
                          onClick={() => handleToggleStatus(u.id, u.name)}
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem' }}
                          title={u.status === 'ACTIVE' ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                        >
                          {u.status === 'ACTIVE' ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>

                        <button
                          className="btn btn-outline"
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          style={{ padding: '0.4rem 0.6rem', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                          title="Hapus Akun Pengguna"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal Dialog */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                <UserPlus size={20} color="#3B82F6" /> Tambah User Baru
              </h3>
              <button className="close-btn" onClick={() => setIsAddModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleAddUserSubmit}>
              <div className="modal-body">
                {errorMsg && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#EF4444', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                    {errorMsg}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Nama Lengkap Pengguna *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Siti Rahmawati"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email / Username Login *</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="siti.rahmawati@gmail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Password akses akun (min. 4 karakter)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Peran Pengguna (Role) *</label>
                  <select
                    className="form-control"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    <option value="USER">User Standard (Pencatatan Keuangan)</option>
                    <option value="SUPER_ADMIN">Admin Utama (Akses Kelola User & Keuangan)</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsAddModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <UserPlus size={16} /> Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
