
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import StudentLoginForm from '@/components/auth/StudentLoginForm';
import { useStudentAuth } from '@/contexts/StudentAuthContext';

const StudentLogin = () => {
  const { student } = useStudentAuth();

  useEffect(() => {
    document.title = 'Student Login | Hostel Management System';
  }, []);

  if (student) {
    return <Navigate to="/student-dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Hostel Management System</h1>
          <p className="text-muted-foreground">Student Portal</p>
        </div>
        <StudentLoginForm />
        <p className="text-center text-sm text-muted-foreground mt-6">
          <a href="/" className="underline underline-offset-4 hover:text-primary">
            Return to Home Page
          </a>
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;
