
import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import NotificationsPanel from './NotificationsPanel';

interface HeaderProps {
  sidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ sidebarCollapsed }) => {
  const { user, logout } = useAuth();
  
  if (!user) return null;
  
  return (
    <header className={`fixed top-0 right-0 z-30 bg-white border-b border-gray-200 h-16 transition-all duration-300 ${
      sidebarCollapsed ? 'left-20' : 'left-64'
    }`}>
      <div className="flex items-center justify-between h-full px-6">
        <h2 className="text-xl font-semibold text-gray-800 capitalize">
          {user.role} Dashboard
        </h2>
        
        <div className="flex items-center space-x-4">
          <NotificationsPanel />
          
          <button 
            onClick={logout}
            className="flex items-center text-gray-700 hover:text-red-500"
          >
            <LogOut className="h-5 w-5 mr-1" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
