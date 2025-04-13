
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Settings, Shield, Users, Building, Bell, Palette, Database } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  
  // State for various settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [systemTheme, setSystemTheme] = useState('light');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  if (!user || user.role !== 'admin') return null;
  
  const handleSaveGeneral = () => {
    toast.success('General settings saved successfully');
  };
  
  const handleSaveSecurity = () => {
    toast.success('Security settings saved successfully');
  };
  
  const handleSaveNotifications = () => {
    toast.success('Notification settings saved successfully');
  };
  
  const handleBackupData = () => {
    toast.success('System backup initiated');
  };
  
  return (
    <DashboardLayout requiredRole="admin">
      <div className="dashboard-container">
        <h1 className="dashboard-title">System Settings</h1>
        
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-5 lg:max-w-4xl">
            <TabsTrigger value="general" className="flex gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage the basic settings of the learning management system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Institution Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-500">Institution Name</label>
                        <Input defaultValue="EduSphere University" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-500">Website URL</label>
                        <Input defaultValue="https://edusphere.edu" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-500">Contact Email</label>
                        <Input defaultValue="admin@edusphere.edu" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-500">Contact Phone</label>
                        <Input defaultValue="+1 (555) 123-4567" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium mb-2">Academic Year</h3>
                      <Select defaultValue="2024-2025">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Academic Year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2023-2024">2023-2024</SelectItem>
                          <SelectItem value="2024-2025">2024-2025</SelectItem>
                          <SelectItem value="2025-2026">2025-2026</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium mb-2">Current Term</h3>
                      <Select defaultValue="spring">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Term" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fall">Fall Semester</SelectItem>
                          <SelectItem value="spring">Spring Semester</SelectItem>
                          <SelectItem value="summer">Summer Term</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">System Appearance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-500">Theme Mode</label>
                        <Select value={systemTheme} onValueChange={setSystemTheme}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light Mode</SelectItem>
                            <SelectItem value="dark">Dark Mode</SelectItem>
                            <SelectItem value="system">System Default</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm text-gray-500">Primary Color</label>
                        <Select defaultValue="blue">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Color" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blue">Blue</SelectItem>
                            <SelectItem value="green">Green</SelectItem>
                            <SelectItem value="purple">Purple</SelectItem>
                            <SelectItem value="red">Red</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm text-gray-500">Font Size</label>
                        <Select defaultValue="medium">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button 
                    onClick={handleSaveGeneral}
                    className="bg-lms-blue hover:bg-lms-blue-dark"
                  >
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure authentication and security parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Password Policy</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="min-length" defaultChecked />
                        <label htmlFor="min-length" className="text-sm">
                          Minimum password length of 8 characters
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="special-chars" defaultChecked />
                        <label htmlFor="special-chars" className="text-sm">
                          Require special characters
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="upper-lower" defaultChecked />
                        <label htmlFor="upper-lower" className="text-sm">
                          Require upper and lowercase letters
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="numbers" defaultChecked />
                        <label htmlFor="numbers" className="text-sm">
                          Require numbers
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="expire" />
                        <label htmlFor="expire" className="text-sm">
                          Passwords expire after 90 days
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Login Security</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="2fa" />
                        <label htmlFor="2fa" className="text-sm">
                          Enable Two-Factor Authentication for all users
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="lockout" defaultChecked />
                        <label htmlFor="lockout" className="text-sm">
                          Account lockout after 5 failed attempts
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="session-timeout" defaultChecked />
                        <label htmlFor="session-timeout" className="text-sm">
                          Session timeout after 30 minutes of inactivity
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium mb-2">Login Page Message</h3>
                    <Input 
                      defaultValue="Welcome to EduSphere LMS. Please log in with your institutional credentials."
                    />
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button 
                    onClick={handleSaveSecurity}
                    className="bg-lms-blue hover:bg-lms-blue-dark"
                  >
                    Save Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management Settings</CardTitle>
                <CardDescription>
                  Configure user registration and account policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">User Registration</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="self-register" />
                        <label htmlFor="self-register" className="text-sm">
                          Allow self-registration
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="admin-approve" defaultChecked />
                        <label htmlFor="admin-approve" className="text-sm">
                          Require admin approval for new accounts
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="email-verify" defaultChecked />
                        <label htmlFor="email-verify" className="text-sm">
                          Require email verification
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Account Policies</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="inactive" defaultChecked />
                        <label htmlFor="inactive" className="text-sm">
                          Automatically deactivate accounts after 180 days of inactivity
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="student-upload" defaultChecked />
                        <label htmlFor="student-upload" className="text-sm">
                          Allow student profile picture uploads
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="faculty-modify" />
                        <label htmlFor="faculty-modify" className="text-sm">
                          Allow faculty to modify student accounts
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium mb-2">Default User Role</h3>
                    <Select defaultValue="student">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Default Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button className="bg-lms-blue hover:bg-lms-blue-dark">
                    Save User Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure system notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="email-enable" 
                          checked={emailNotifications} 
                          onCheckedChange={(checked) => setEmailNotifications(checked as boolean)}
                        />
                        <label htmlFor="email-enable" className="text-sm">
                          Enable email notifications
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="email-assignment" defaultChecked disabled={!emailNotifications} />
                        <label htmlFor="email-assignment" className="text-sm">
                          Send notifications for new assignments
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="email-grades" defaultChecked disabled={!emailNotifications} />
                        <label htmlFor="email-grades" className="text-sm">
                          Send notifications for new grades
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="email-course" defaultChecked disabled={!emailNotifications} />
                        <label htmlFor="email-course" className="text-sm">
                          Send notifications for course announcements
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">In-App Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="app-enable" defaultChecked />
                        <label htmlFor="app-enable" className="text-sm">
                          Enable in-app notifications
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="app-sound" defaultChecked />
                        <label htmlFor="app-sound" className="text-sm">
                          Play sound for new notifications
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="app-auto-clear" />
                        <label htmlFor="app-auto-clear" className="text-sm">
                          Automatically clear notifications after 7 days
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium mb-2">Notification Frequency</h3>
                    <Select defaultValue="immediate">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="hourly">Hourly Digest</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Digest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button 
                    onClick={handleSaveNotifications}
                    className="bg-lms-blue hover:bg-lms-blue-dark"
                  >
                    Save Notification Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Maintenance</CardTitle>
                <CardDescription>
                  Manage system maintenance and data backup settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">System Status</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="maintenance" 
                          checked={maintenanceMode} 
                          onCheckedChange={(checked) => setMaintenanceMode(checked as boolean)}
                        />
                        <label htmlFor="maintenance" className="text-sm">
                          Enable maintenance mode
                        </label>
                      </div>
                      
                      {maintenanceMode && (
                        <div className="ml-6 space-y-2">
                          <label className="text-sm text-gray-500">Maintenance Message</label>
                          <Input 
                            defaultValue="System is currently undergoing maintenance. Please check back later."
                          />
                          <p className="text-xs text-gray-500">
                            When maintenance mode is enabled, only administrators can access the system.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Data Backup</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="auto-backup" defaultChecked />
                        <label htmlFor="auto-backup" className="text-sm">
                          Enable automatic backups
                        </label>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm text-gray-500">Backup Frequency</label>
                        <Select defaultValue="daily">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm text-gray-500">Backup Retention</label>
                        <Select defaultValue="30">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Retention Period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="365">1 year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        onClick={handleBackupData}
                        variant="outline"
                      >
                        Backup Now
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium mb-2">System Logs</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="debug-logs" />
                        <label htmlFor="debug-logs" className="text-sm">
                          Enable debug logging
                        </label>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm text-gray-500">Log Retention</label>
                        <Select defaultValue="30">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Retention Period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button variant="outline">
                        View System Logs
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button className="bg-lms-blue hover:bg-lms-blue-dark">
                    Save System Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
