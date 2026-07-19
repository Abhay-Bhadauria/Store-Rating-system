import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@services/auth.service';
import { storage } from '@utils';
import { ROLES } from '@constants';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Auto-authenticate on app load
  useEffect(() => {
    const initAuth = () => {
      const token = storage.getToken();
      const savedUser = storage.getUser();

      if (token && savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;

        // Store in localStorage
        storage.setToken(token);
        storage.setUser(userData);

        // Update state
        setUser(userData);
        setIsAuthenticated(true);

        return { success: true };
      }

      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'An error occurred during login',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);

      if (response.success && response.data) {
        const { user: newUser, token } = response.data;

        // Store in localStorage
        storage.setToken(token);
        storage.setUser(newUser);

        // Update state
        setUser(newUser);
        setIsAuthenticated(true);

        return { success: true };
      }

      return { success: false, message: response.message || 'Registration failed' };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'An error occurred during registration',
      };
    }
  };

  const logout = () => {
    // Clear localStorage
    storage.clearAuth();

    // Clear state
    setUser(null);
    setIsAuthenticated(false);
  };

  const updatePassword = async (passwordData) => {
    try {
      const response = await authService.updatePassword(passwordData);

      if (response.success) {
        return { success: true };
      }

      return { success: false, message: response.message || 'Password update failed' };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'An error occurred during password update',
      };
    }
  };

  const isAdmin = user?.role === ROLES.ADMIN;
  const isStoreOwner = user?.role === ROLES.STORE_OWNER;
  const isNormalUser = user?.role === ROLES.NORMAL_USER;

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isStoreOwner,
    isNormalUser,
    login,
    register,
    logout,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

