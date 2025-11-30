import { createContext, useContext, useState, useEffect } from 'react';

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
      // Check local users stored in localStorage
      const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
      const matched = localUsers.find((u) => u.email === email && u.password === password);
      if (matched) {
        const user = { id: matched.id, name: matched.name, email: matched.email, role: matched.role };
        const token = `local-token-${Date.now()}`;
        saveSession(user, token);
        return { user, token };
      }
      throw new Error('Invalid email or password. Please check your credentials or register first.');
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  const register = async (email, password, name, role) => {
    try {
      // Create a new local user
      const user = { 
        id: `local-${Date.now()}`, 
        name: name || (email.split('@')[0] || 'User'), 
        email, 
        role: role || 'customer', 
        password 
      };
      
      const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
      
      // Check if user already exists
      if (localUsers.find((u) => u.email === email)) {
        throw new Error('Email already registered. Please log in instead.');
      }
      
      localUsers.push(user);
      localStorage.setItem('localUsers', JSON.stringify(localUsers));
      
      const token = `local-token-${Date.now()}`;
      saveSession({ id: user.id, name: user.name, email: user.email, role: user.role }, token);
      return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
    } catch (err) {
      console.error('Registration failed:', err);
      throw err;
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
        console.error('Failed to parse currentUser:', e);
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
