// Google Identity Services (GIS) & Authentication Service

const AUTH_STORAGE_KEY = 'fc_user_session';
// Default Client ID placeholder (Can be overridden via VITE_GOOGLE_CLIENT_ID env)
export const DEFAULT_GOOGLE_CLIENT_ID = '1084293842104-demoappclientid.apps.googleusercontent.com';

export const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT token:', e);
    return null;
  }
};

const USERS_STORAGE_KEY = 'fc_users_list_v1';

const DEFAULT_USERS = [
  {
    id: 'user-super-admin-01',
    name: 'Admin Utama',
    email: 'rolandbianci@gmail.com',
    password: 'admin123',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    createdAt: '2026-09-01',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rolandbianci@gmail.com'
  },
  {
    id: 'user-default-01',
    name: 'Rahma',
    email: 'mbah.rah17@gmail.com',
    password: 'user123',
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '2026-09-01',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mbah.rah17@gmail.com'
  }
];

export const authService = {
  // Initialize registered users in storage
  initUsers() {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      const parsed = JSON.parse(data);
      // Ensure new default admin & user exist in parsed list
      const hasAdmin = parsed.some(u => u.email.toLowerCase() === 'rolandbianci@gmail.com');
      const hasUser = parsed.some(u => u.email.toLowerCase() === 'mbah.rah17@gmail.com');
      if (!hasAdmin || !hasUser) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to parse users list:', e);
      return DEFAULT_USERS;
    }
  },

  // Get list of all users
  getUsers() {
    return this.initUsers();
  },

  // Add new user (Super Admin functionality)
  addUser({ name, email, password, role = 'USER' }) {
    const users = this.getUsers();
    
    // Check if email/username already exists
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error(`Pengguna dengan Email / Username "${email}" sudah terdaftar.`);
    }

    const newUser = {
      id: 'user-' + Date.now(),
      name,
      email,
      password: password || 'user123',
      role: role || 'USER',
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`
    };

    users.unshift(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return newUser;
  },

  // Toggle user active / inactive status
  toggleUserStatus(userId) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('Pengguna tidak ditemukan.');
    
    // Prevent deactivating the main super admin if it's the only one
    if (users[index].email === 'admin@financecraft.com' && users[index].status === 'ACTIVE') {
      const activeAdmins = users.filter(u => u.role === 'SUPER_ADMIN' && u.status === 'ACTIVE');
      if (activeAdmins.length <= 1) {
        throw new Error('Tidak dapat menonaktifkan Admin Utama terakhir.');
      }
    }

    users[index].status = users[index].status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return users[index];
  },

  // Delete user
  deleteUser(userId) {
    let users = this.getUsers();
    const target = users.find(u => u.id === userId);
    if (!target) return;

    if (target.email === 'admin@financecraft.com') {
      throw new Error('Akun Admin Utama bawaan sistem tidak dapat dihapus.');
    }

    users = users.filter(u => u.id !== userId);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  },

  // Login with Username/Email & Password
  loginWithCredentials(emailOrUsername, password) {
    const users = this.getUsers();
    const user = users.find(
      u => (u.email.toLowerCase() === emailOrUsername.toLowerCase() || u.name.toLowerCase() === emailOrUsername.toLowerCase())
    );

    if (!user) {
      throw new Error('Email / Username tidak terdaftar dalam sistem.');
    }

    if (user.password !== password) {
      throw new Error('Password yang Anda masukkan salah.');
    }

    if (user.status !== 'ACTIVE') {
      throw new Error('Akun Anda sedang dinonaktifkan oleh Admin Utama.');
    }

    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email)}`,
      provider: 'credentials'
    };

    return this.saveSession(userProfile);
  },

  // Get active session
  getCurrentUser() {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  // Save user session
  saveSession(userProfile) {
    const sessionData = {
      ...userProfile,
      loginAt: new Date().toISOString()
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
    return sessionData;
  },

  // Logout active session
  logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  // Handle Google OAuth Credential Response
  handleGoogleCredential(credentialResponse) {
    if (!credentialResponse || !credentialResponse.credential) {
      throw new Error('Respons kredensial Google tidak valid.');
    }

    const payload = parseJwt(credentialResponse.credential);
    if (!payload) {
      throw new Error('Gagal menguraikan token kredensial Google.');
    }

    // Check if registered user exists to retrieve role, else assign default role
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === payload.email.toLowerCase());

    const isSuperAdminEmail = payload.email.toLowerCase() === 'admin@financecraft.com';
    const role = existing ? existing.role : (isSuperAdminEmail ? 'SUPER_ADMIN' : 'USER');

    if (existing && existing.status !== 'ACTIVE') {
      throw new Error('Akun Anda sedang dinonaktifkan oleh Admin Utama.');
    }

    const userProfile = {
      id: payload.sub,
      name: payload.name || payload.given_name || 'Pengguna Google',
      email: payload.email,
      role,
      avatar: payload.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${payload.email}`,
      provider: 'google'
    };

    return this.saveSession(userProfile);
  },

  // Demo Login (Instant testing option)
  loginDemo(name = 'Budi Santoso', email = 'budi.santoso@gmail.com', role = 'USER') {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    const isSuperAdmin = email.toLowerCase().includes('admin') || role === 'SUPER_ADMIN' || (existing && existing.role === 'SUPER_ADMIN');

    const userProfile = {
      id: existing ? existing.id : 'google-user-demo-101',
      name: existing ? existing.name : name,
      email: existing ? existing.email : email,
      role: isSuperAdmin ? 'SUPER_ADMIN' : 'USER',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      provider: 'demo'
    };
    return this.saveSession(userProfile);
  },

  // Dynamically load Google GIS Client SDK script
  loadGoogleScript(callback) {
    if (window.google && window.google.accounts) {
      callback();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => callback();
    document.head.appendChild(script);
  }
};

