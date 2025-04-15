
import { Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Home, AlertCircle, Building2 } from 'lucide-react';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Hostel Management System</h1>
          </div>
          <nav className="hidden md:flex gap-4">
            <Button variant="ghost" asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" /> Home
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/leave-request">
                <FileText className="mr-2 h-4 w-4" /> Leave Request
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/complaint">
                <AlertCircle className="mr-2 h-4 w-4" /> File Complaint
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/inquiry">
                <Building2 className="mr-2 h-4 w-4" /> General Inquiry
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/login">Admin Login</Link>
            </Button>
          </nav>
          <div className="md:hidden">
            <Button variant="outline">Menu</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <Outlet />
      </main>

      <footer className="border-t bg-muted mt-auto">
        <div className="container mx-auto p-6 text-center text-sm text-muted-foreground">
          &copy; 2025 Hostel Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
