import React, { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: 'Assignment Due Soon',
    message: 'Your "Basic Programming Concepts" assignment is due in 2 days.',
    timestamp: '2025-04-28T10:30:00',
    read: false
  },
  {
    id: 2,
    title: 'Course Material Added',
    message: 'New lecture slides for "Data Structures" have been uploaded.',
    timestamp: '2025-04-27T14:15:00',
    read: false
  },
  {
    id: 3,
    title: 'Grade Posted',
    message: 'You received a grade for "Control Structures" assignment.',
    timestamp: '2025-04-26T09:45:00',
    read: true
  }
];

const NotificationsPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);
  const [open, setOpen] = useState(false);
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };
  
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const clearAll = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
    setOpen(false);
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // Check if it's today
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Check if it's yesterday
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise return the full date
    return date.toLocaleString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-lg">Notifications</h3>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear all
              </Button>
            </div>
          )}
        </div>
        
        <Separator className="my-2" />
        
        {notifications.length > 0 ? (
          <div className="max-h-80 overflow-y-auto divide-y">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`py-3 px-1 ${!notification.read ? 'bg-slate-50' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex justify-between">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <span className="text-xs text-gray-500">{formatTimestamp(notification.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Bell className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">No notifications yet</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPanel;
