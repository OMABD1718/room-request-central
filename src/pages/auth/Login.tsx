
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { admin } = useAuth();

  useEffect(() => {
    document.title = 'Login | Hostel Management System';
  }, []);

  if (admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Hostel Management System</h1>
          <p className="text-muted-foreground">Admin Login Portal</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground mt-6">
          <a href="/" className="underline underline-offset-4 hover:text-primary">
            Return to Home Page
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
