
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Student } from '@/types';

type StudentAuthContextType = {
  student: Student | null;
  loading: boolean;
  login: (rollNo: string, password: string) => Promise<void>;
  logout: () => void;
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined);

export const useStudentAuth = () => {
  const context = useContext(StudentAuthContext);
  if (context === undefined) {
    throw new Error('useStudentAuth must be used within a StudentAuthProvider');
  }
  return context;
};

export const StudentAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check localStorage on initial load
  useEffect(() => {
    const storedStudent = localStorage.getItem('hostelStudentUser');
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));
    }
    setLoading(false);
  }, []);

  // For this implementation, we're using a simple authorization system
  // In a real implementation, this would connect to Supabase Auth
  const login = async (rollNo: string, password: string) => {
    setLoading(true);
    
    try {
      // Fetch student by roll number
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('roll_no', rollNo)
        .single();
      
      if (error) throw new Error('Student not found');
      
      // In a real implementation, we would verify the password with Supabase Auth
      // For now, we're using a simple mock password check (all passwords are "password")
      if (password !== 'password') {
        throw new Error('Invalid password');
      }
      
      // Adapt the data format to match our Student type
      const studentData: Student = {
        id: data.id,
        name: data.name,
        rollNo: data.roll_no,
        roomNo: data.room_no,
        contactNumber: data.contact_number,
        email: data.email
      };
      
      setStudent(studentData);
      localStorage.setItem('hostelStudentUser', JSON.stringify(studentData));
      
      toast({
        title: "Login successful!",
        description: `Welcome ${studentData.name}`,
      });
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
    setStudent(null);
    localStorage.removeItem('hostelStudentUser');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };
  
  return (
    <StudentAuthContext.Provider value={{ student, loading, login, logout }}>
      {children}
    </StudentAuthContext.Provider>
  );
};
