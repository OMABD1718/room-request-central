
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Home, Users, BedDouble, FileText, AlertCircle, 
  CreditCard, LogOut, Menu, X, Building2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      title: 'Students',
      href: '/dashboard/students',
      icon: Users,
    },
    {
      title: 'Rooms',
      href: '/dashboard/rooms',
      icon: BedDouble,
    },
    {
      title: 'Leave Requests',
      href: '/dashboard/leave-requests',
      icon: FileText,
    },
    {
      title: 'Complaints',
      href: '/dashboard/complaints',
      icon: AlertCircle,
    },
    {
      title: 'Fee Tracking',
      href: '/dashboard/fee-tracking',
      icon: CreditCard,
    },
    {
      title: 'Inquiries',
      href: '/dashboard/inquiries',
      icon: Building2,
    },
  ];

  return (
    <div className={cn(
      'border-r bg-background transition-all duration-300 flex flex-col',
      collapsed ? 'w-16' : 'w-64',
      className
    )}>
      <div className="flex h-14 items-center px-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle sidebar"
          className="h-8 w-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </Button>
        {!collapsed && (
          <span className="ml-2 font-semibold">Hostel Management</span>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="py-4">
          <nav className="grid gap-1 px-2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors',
                  location.pathname === item.href
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <item.icon size={18} />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <Button variant="ghost" className={cn(
          'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors',
          collapsed && 'justify-center'
        )} onClick={logout}>
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
