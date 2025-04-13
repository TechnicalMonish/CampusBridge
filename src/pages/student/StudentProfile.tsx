
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import ProfileEditor from '@/components/student/ProfileEditor';

const StudentProfile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [bio, setBio] = useState(user?.bio || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  if (!user || user.role !== 'student') return null;
  
  const handleUpdateProfile = () => {
    setIsLoading(true);
    // Simulate profile update
    setTimeout(() => {
      updateUserProfile({ bio });
      setIsLoading(false);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    }, 1000);
  };
  
  return (
    <DashboardLayout requiredRole="student">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Your Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatar || ''} />
                  <AvatarFallback className="text-xl">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-500 mb-2">{user.email}</p>
                <div className="bg-lms-green-light text-lms-green py-1 px-3 rounded-full text-sm font-medium">
                  Student
                </div>
                
                <div className="mt-6 text-left w-full">
                  <h3 className="font-medium mb-2">About Me</h3>
                  <p className="text-sm text-gray-600">
                    {user.bio || 'Computer Science student passionate about software development and AI.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Edit Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileEditor />
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Email Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Assignment Reminders</span>
                      <Button variant="outline" size="sm" onClick={() => toast.success('Setting updated')}>Enable</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Course Updates</span>
                      <Button variant="outline" size="sm" onClick={() => toast.success('Setting updated')}>Enable</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weekly Digest</span>
                      <Button variant="outline" size="sm" onClick={() => toast.success('Setting updated')}>Disable</Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Password</h3>
                  <Button 
                    variant="outline" 
                    onClick={() => toast.success('Password reset link sent to your email')}
                  >
                    Change Password
                  </Button>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Privacy</h3>
                  <Button 
                    variant="outline" 
                    onClick={() => toast.success('Privacy settings updated')}
                  >
                    Manage Privacy Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
