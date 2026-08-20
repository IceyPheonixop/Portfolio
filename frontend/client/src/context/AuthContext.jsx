import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/auth/me')
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        } else if (data && !data.message) {
          setUser(data);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (values) => {
    const d = await api('/auth/login', { method: 'POST', body: values });
    if (d?.token) {
      localStorage.setItem('vault_token', d.token);
      localStorage.setItem('token', d.token);
    }
    setUser(d?.user || d);
    return d;
  };

  const logout = async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch {}
    localStorage.removeItem('vault_token');
    localStorage.removeItem('token');
    setUser(null);
  };
  
return (
  <AuthContext.Provider value={{ user, loading, login, logout }}>
    {!loading ? (
      children
    ) : (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        Loading...
      </div>
    )}
  </AuthContext.Provider>
);
}

export const useAuth = () => useContext(AuthContext);