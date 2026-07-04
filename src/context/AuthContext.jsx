import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [appMode, setAppModeState] = useState(localStorage.getItem('appMode') || 'user');

  const setAppMode = (mode) => {
    setAppModeState(mode);
    localStorage.setItem('appMode', mode);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
  };

  const logout = () => {
    setUser(null);
    setAppMode('user');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('appMode');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, appMode, setAppMode }}>
      {children}
    </AuthContext.Provider>
  );
};
