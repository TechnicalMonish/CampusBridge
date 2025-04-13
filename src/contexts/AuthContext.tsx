
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Dummy data for users
const USERS = [
  { id: 1, name: 'John Doe', email: 'student1@example.com', password: 'password123', role: 'student' as UserRole },
  { id: 2, name: 'Jane Smith', email: 'student2@example.com', password: 'password123', role: 'student' as UserRole },
  { id: 3, name: 'Dr. Robert Johnson', email: 'faculty@example.com', password: 'password123', role: 'faculty' as UserRole },
  { id: 4, name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin' as UserRole }
];

// Type definitions
export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  bio?: string;
}

type ProfileUpdateData = {
  name?: string;
  bio?: string;
  avatar?: string | null;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUserProfile: (data: ProfileUpdateData) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('lms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (foundUser) {
      // Remove password before storing user
      const { password, ...userWithoutPassword } = foundUser;
      // Ensure the role is properly typed as UserRole
      const typedUser: User = {
        ...userWithoutPassword,
        role: userWithoutPassword.role as UserRole
      };
      
      setUser(typedUser);
      localStorage.setItem('lms_user', JSON.stringify(typedUser));
      
      toast.success('Logged in successfully!');
      setLoading(false);
      return true;
    } else {
      toast.error('Invalid email or password');
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('lms_user');
    toast.info('Logged out successfully');
    navigate('/login');
  };

  // Update user profile
  const updateUserProfile = (data: ProfileUpdateData) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('lms_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
