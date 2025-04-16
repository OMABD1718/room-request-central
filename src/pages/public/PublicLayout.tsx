
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  FileText, Home, AlertCircle, Building2, LogIn, Menu, X, User, LayoutDashboard
} from 'lucide-react';
import { useState } from 'react';
import { useStudentAuth } from '@/contexts/StudentAuthContext';
import { 
  Sheet, SheetContent, SheetTrigger, SheetClose
} from '@/components/ui/sheet';

const PublicLayout = () => {
  const { student, logout } = useStudentAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      title: 'Home',
      href: '/',
      icon: Home,
    },
    {
      title: 'Leave Request',
      href: '/leave-request',
      icon: FileText,
    },
    {
      title: 'File Complaint',
      href: '/complaint',
      icon: AlertCircle,
    },
    {
      title: 'General Inquiry',
      href: '/inquiry',
      icon: Building2,
    },
  ];

  // Add student dashboard to nav items if student is logged in
  const allNavItems = student 
    ? [...navItems, {
        title: 'My Dashboard',
        href: '/student-dashboard',
        icon: LayoutDashboard,
      }]
    : navItems;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Hostel Management System</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-4">
            {allNavItems.map((item, index) => (
              <Button 
                key={index} 
                variant="ghost" 
                asChild
                className={location.pathname === item.href ? 'bg-accent text-accent-foreground' : ''}
              >
                <Link to={item.href}>
                  <item.icon className="mr-2 h-4 w-4" /> {item.title}
                </Link>
              </Button>
            ))}
            
            {student ? (
              <div className="flex items-center gap-2 ml-2">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium">{student.name}</span>
                  <span className="text-xs text-muted-foreground">{student.rollNo}</span>
                </div>
                <Button variant="outline" onClick={logout}>Logout</Button>
              </div>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/student-login">
                    <User className="mr-2 h-4 w-4" /> Student Login
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/login">Admin Login</Link>
                </Button>
              </>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 py-4">
                  {allNavItems.map((item, index) => (
                    <SheetClose key={index} asChild>
                      <Link 
                        to={item.href}
                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors ${
                          location.pathname === item.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </Link>
                    </SheetClose>
                  ))}
                  
                  <div className="border-t my-2 pt-2">
                    {student ? (
                      <>
                        <div className="px-3 py-2">
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.rollNo}</p>
                        </div>
                        <SheetClose asChild>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start px-3" 
                            onClick={() => {
                              logout();
                              setMobileMenuOpen(false);
                            }}
                          >
                            Logout
                          </Button>
                        </SheetClose>
                      </>
                    ) : (
                      <>
                        <SheetClose asChild>
                          <Link 
                            to="/student-login" 
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <User size={18} />
                            <span>Student Login</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link 
                            to="/login" 
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <LogIn size={18} />
                            <span>Admin Login</span>
                          </Link>
                        </SheetClose>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
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
