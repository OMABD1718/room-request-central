
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, User } from 'lucide-react';

const Header = () => {
  const { admin } = useAuth();

  return (
    <header className="border-b bg-background h-14 flex items-center px-6 sticky top-0 z-30">
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{admin?.name || 'Admin'}</p>
            <p className="text-xs text-muted-foreground">{admin?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
