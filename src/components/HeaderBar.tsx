import { Link, NavLink } from 'react-router-dom';
import { Bell, HelpCircle, ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

const user = {
  fullName: 'Alex Morgan',
  accountId: 'BH-482913',
};

export default function HeaderBar() {
  const [isOpen, setIsOpen] = useState(false);
  
  const [notifications] = useState([
    {
      id: '1',
      title: 'Send request has been approved',
      subtitle: 'Transaction ID: 01906912',
      time: '17:53 23.06.2025',
      isNew: true
    },
    {
      id: '2', 
      title: '6 240 EUR Deposit Transfer',
      subtitle: 'Transaction ID: 66538135',
      time: '17:54 23.06.2025',
      isNew: true
    },
    {
      id: '3',
      title: '0.2073 BTC Deposit Transfer', 
      subtitle: 'Transaction ID: 66538135',
      time: '17:54 23.06.2025',
      isNew: true
    },
    {
      id: '4',
      title: 'Send request has been approved',
      subtitle: 'Transaction ID: 01906912', 
      time: '17:53 23.06.2025',
      isNew: false
    }
  ]);
  
  const newNotificationsCount = notifications.filter(n => n.isNew).length;
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-screen-xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/overview" className="font-semibold tracking-tight">BITHARBOUR</Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/overview" className={({
            isActive
          }) => `text-sm ${isActive ? 'text-primary' : 'text-foreground/80'}`} style={{ fontSize: '14px' }}>Overview</NavLink>
            <NavLink to="/terminal" className={({
            isActive
          }) => `text-sm ${isActive ? 'text-primary' : 'text-foreground/80'}`} style={{ fontSize: '14px' }}>Exchange</NavLink>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm text-foreground/80 hover:text-primary p-0 h-auto font-normal">
                  Settings
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2 bg-background border border-border shadow-lg">
                <div className="space-y-1">
                  <NavLink to="/settings" className="block px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                    General Settings
                  </NavLink>
                  <NavLink to="/settings#activate" className="block px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                    Activate Account
                  </NavLink>
                  <NavLink to="/settings#verification" className="block px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                    Verification
                  </NavLink>
                </div>
              </PopoverContent>
            </Popover>
          </nav>
        </div>

        {/* Desktop Right Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <button 
                aria-label="Notifications" 
                className="relative text-foreground/80 hover:text-primary transition-colors"
              >
                <Bell className="h-5 w-5" />
                {newNotificationsCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs min-w-5"
                  >
                    {newNotificationsCount}
                  </Badge>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0 bg-background border border-border shadow-lg" align="end">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-lg">All Notifications ({notifications.length})</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-3 p-4 border-b last:border-b-0 hover:bg-accent/50 transition-colors">
                    <div className="mt-1">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm leading-5">{notification.title}</p>
                          <p className="text-muted-foreground text-sm mt-1">{notification.subtitle}</p>
                        </div>
                        <time className="text-muted-foreground text-xs whitespace-nowrap">
                          {notification.time}
                        </time>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <button aria-label="Help" className="text-foreground/80">
            <HelpCircle className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 pl-3 ml-3 border-l">
            <div className="text-sm">
              <div className="font-medium leading-none">{user.fullName}</div>
              <div className="text-muted-foreground text-xs">{user.accountId}</div>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <div className="py-6 space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="text-sm">
                  <div className="font-medium leading-none">{user.fullName}</div>
                  <div className="text-muted-foreground text-xs">{user.accountId}</div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-4">
                <NavLink 
                  to="/overview" 
                  className={({ isActive }) => `block py-2 text-lg ${isActive ? 'text-primary font-medium' : 'text-foreground'}`}
                  onClick={() => setIsOpen(false)}
                >
                  Overview
                </NavLink>
                <NavLink 
                  to="/terminal" 
                  className={({ isActive }) => `block py-2 text-lg ${isActive ? 'text-primary font-medium' : 'text-foreground'}`}
                  onClick={() => setIsOpen(false)}
                >
                  Exchange
                </NavLink>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Settings</p>
                  <NavLink 
                    to="/settings" 
                    className="block py-2 pl-4 text-base text-foreground hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    General Settings
                  </NavLink>
                  <NavLink 
                    to="/settings#activate" 
                    className="block py-2 pl-4 text-base text-foreground hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Activate Account
                  </NavLink>
                  <NavLink 
                    to="/settings#verification" 
                    className="block py-2 pl-4 text-base text-foreground hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Verification
                  </NavLink>
                </div>
              </nav>

              <Separator />

              {/* Mobile Actions */}
              <div className="space-y-4">
                <button 
                  aria-label="Notifications" 
                  className="flex items-center gap-3 w-full py-2 text-left text-foreground hover:text-primary"
                >
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                  {newNotificationsCount > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {newNotificationsCount}
                    </Badge>
                  )}
                </button>
                <button 
                  aria-label="Help" 
                  className="flex items-center gap-3 w-full py-2 text-left text-foreground hover:text-primary"
                >
                  <HelpCircle className="h-5 w-5" />
                  <span>Help</span>
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
