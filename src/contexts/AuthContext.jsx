import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const saveSession = (userObj, token) => {
    if (token) localStorage.setItem('token', token);
    if (userObj) localStorage.setItem('currentUser', JSON.stringify(userObj));
    setUser(userObj);
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${api.API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Login failed');
      saveSession(data.user, data.token);
      return data;
    } catch (err) {
      console.warn('Auth login failed, attempting local fallback', err);
      // Try local users stored in localStorage (created by register fallback)
      try {
        const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
        const matched = localUsers.find((u) => u.email === email && u.password === password);
        if (matched) {
          const user = { id: matched.id, name: matched.name, email: matched.email, role: matched.role };
          const token = `local-token-${Date.now()}`;
          saveSession(user, token);
          return { user, token, localFallback: true };
        }
        throw new Error('No local account found. Please register first.');
      } catch (localErr) {
        console.warn('Local fallback login failed', localErr);
        throw localErr;
      }
    }
  };

  const register = async (email, password, name, role) => {
    try {
      const res = await fetch(`${api.API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Registration failed');
      saveSession(data.user, data.token);
      return data;
    } catch (err) {
      console.warn('Auth register failed, creating local account', err);
      // Persist a simple local user record so local login can later authenticate
      const user = { id: `local-${Date.now()}`, name: name || (email.split('@')[0] || 'Dev User'), email, role: role || 'customer', password };
      try {
        const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
        localUsers.push(user);
        localStorage.setItem('localUsers', JSON.stringify(localUsers));
      } catch (storeErr) {
        console.warn('Failed to persist local user', storeErr);
      }
      const token = `local-token-${Date.now()}`;
      saveSession({ id: user.id, name: user.name, email: user.email, role: user.role }, token);
      return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token, localFallback: true };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to parse currentUser', e);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
