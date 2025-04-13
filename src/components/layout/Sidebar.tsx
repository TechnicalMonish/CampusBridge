
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, 
  BookText, 
  GraduationCap, 
  FileText, 
  Code, 
  Users, 
  BarChart, 
  Home, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleCollapse }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) return null;
  
  // Define navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      { name: 'Dashboard', path: `/${user.role}`, icon: Home }
    ];
    
    if (user.role === 'student') {
      return [
        ...baseItems,
        { name: 'My Courses', path: '/student/courses', icon: BookOpen },
        { name: 'Assignments', path: '/student/assignments', icon: FileText },
        { name: 'Attendance', path: '/student/attendance', icon: Users },
        { name: 'Code Practice', path: '/student/code', icon: Code },
      ];
    }
    
    if (user.role === 'faculty') {
      return [
        ...baseItems,
        { name: 'My Courses', path: '/faculty/courses', icon: BookOpen },
        { name: 'Course Materials', path: '/faculty/materials', icon: BookText },
        { name: 'Assignments', path: '/faculty/assignments', icon: FileText },
        { name: 'Student Analytics', path: '/faculty/analytics', icon: BarChart },
      ];
    }
    
    if (user.role === 'admin') {
      return [
        ...baseItems,
        { name: 'All Courses', path: '/admin/courses', icon: BookOpen },
        { name: 'Faculty Members', path: '/admin/faculty', icon: GraduationCap },
        { name: 'Students', path: '/admin/students', icon: Users },
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
      ];
    }
    
    return baseItems;
  };
  
  const navItems = getNavItems();
  
  return (
    <aside className={cn(
      "h-screen fixed left-0 top-0 z-40 flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h1 className="text-xl font-bold text-lms-blue">EduSphere</h1>
        )}
        <button 
          onClick={toggleCollapse}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          )}
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center p-3 rounded-lg text-gray-700 hover:bg-lms-blue-light hover:text-lms-blue transition-all",
                    location.pathname === item.path && "bg-lms-blue-light text-lms-blue font-medium"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        {!collapsed && (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-lms-blue-light flex items-center justify-center text-lms-blue font-semibold">
              {user.name.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
