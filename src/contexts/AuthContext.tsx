
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

type Admin = {
  id: string;
  email: string;
  name: string;
};

interface AuthContextType {
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Check localStorage on initial load
  useEffect(() => {
    const storedAdmin = localStorage.getItem('hostelAdminUser');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setLoading(false);
  }, []);
  
  // For this version, we'll use mock admin credentials
  // In a real implementation, this would connect to a backend service
  const mockAdminCredentials = {
    email: 'admin@hostel.com',
    password: 'admin123',
    name: 'Admin User',
    id: '1'
  };
  
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Simple mock login
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (email === mockAdminCredentials.email && password === mockAdminCredentials.password) {
        const adminUser = {
          id: mockAdminCredentials.id,
          email: mockAdminCredentials.email,
          name: mockAdminCredentials.name
        };
        
        setAdmin(adminUser);
        localStorage.setItem('hostelAdminUser', JSON.stringify(adminUser));
        toast({
          title: "Login successful!",
          description: "Welcome to Hostel Management System",
        });
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('hostelAdminUser');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };
  
  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
