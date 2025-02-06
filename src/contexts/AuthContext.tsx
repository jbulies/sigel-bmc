import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:8080';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email, passwordLength: password.length });
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password: password.trim() // Asegurarse de que la contraseña esté limpia
        }),
      });

      console.log('Server response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('token', data.token);
        toast.success('Inicio de sesión exitoso');
        navigate('/');
      } else {
        console.error('Response error:', data);
        toast.error(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Error al conectar con el servidor');
    }
  }, [navigate]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/auth/login');
    toast.success('Sesión cerrada exitosamente');
  }, [navigate]);

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};