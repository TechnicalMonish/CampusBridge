import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Pencil, Check, X, Mail, Phone, MapPin, Bookmark, Calendar, Code } from 'lucide-react';
import { toast } from 'sonner';

const StudentProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const { getStudentCourses, getStudentCodeSubmissions } = useData();
  
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('Computer Science student passionate about programming and problem-solving.');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('(555) 123-4567');
  const [location, setLocation] = useState('Campus Residence Hall, Room 304');
  const [avatar, setAvatar] = useState<string | null>(null);
  
  const studentCourses = user?.id ? getStudentCourses(+user.id) : [];
  const codeSubmissions = user?.id ? getStudentCodeSubmissions(+user.id) : [];
  
  const completedAssignments = 8; // Sample data
  const attendanceRate = 92; // Sample data
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = () => {
    if (updateUserProfile) {
      updateUserProfile({ name, avatar });
      toast.success('Profile updated successfully!');
      setEditing(false);
    }
  };
  
  const handleCancel = () => {
    setName(user?.name || '');
    setEditing(false);
  };
  
  return (
    <DashboardLayout requiredRole="student">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Your Profile</h1>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="academic">Academic Info</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Profile</span>
                    {!editing ? (
                      <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={handleCancel}>
                          <X className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleSave}>
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <Avatar className="w-32 h-32 border-4 border-white shadow">
                      <AvatarImage src={avatar || undefined} />
                      <AvatarFallback className="text-4xl bg-lms-blue-light text-lms-blue">
                        {name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    {editing && (
                      <div className="absolute bottom-0 right-0">
                        <label 
                          htmlFor="avatar-upload" 
                          className="bg-lms-blue text-white p-2 rounded-full cursor-pointer shadow-lg"
                        >
                          <Pencil className="h-4 w-4" />
                        </label>
                        <input 
                          id="avatar-upload" 
                          type="file" 
                          accept="image/*" 
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </div>
                    )}
                  </div>
                  
                  {editing ? (
                    <div className="w-full space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Input 
                          id="bio" 
                          value={bio} 
                          onChange={(e) => setBio(e.target.value)} 
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold">{name}</h3>
                      <p className="text-gray-500 mt-1">{user?.email}</p>
                      <p className="text-sm mt-4">{bio}</p>
                    </>
                  )}
                  
                  <Separator className="my-6" />
                  
                  <div className="w-full space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-500 mr-3" />
                      <span>{email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-500 mr-3" />
                      <span>{phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-500 mr-3" />
                      <span>{location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-3" />
                      <span>Started Fall 2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="md:col-span-2 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-3xl font-bold text-lms-blue">{studentCourses.length}</h3>
                      <p className="text-sm text-gray-500">Active Courses</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-3xl font-bold text-lms-blue">{completedAssignments}</h3>
                      <p className="text-sm text-gray-500">Assignments</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-3xl font-bold text-lms-blue">{attendanceRate}%</h3>
                      <p className="text-sm text-gray-500">Attendance</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Your Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {studentCourses.length > 0 ? (
                      <div className="space-y-4">
                        {studentCourses.map(course => (
                          <div key={course.id} className="flex items-center p-3 border rounded-lg">
                            <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden mr-4">
                              <img 
                                src={course.thumbnail} 
                                alt={course.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{course.title}</h4>
                              <p className="text-sm text-gray-500">{course.code} • {course.instructor}</p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <a href={`/student/courses?id=${course.id}`}>
                                <Bookmark className="h-4 w-4 mr-1" />
                                View
                              </a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-6 text-gray-500">
                        No courses enrolled yet
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {codeSubmissions.slice(0, 3).map(submission => (
                        <div key={submission.id} className="flex items-center p-3 border rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-lms-blue-light text-lms-blue flex items-center justify-center mr-4">
                            <Code className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">Submitted a {submission.language} solution</h4>
                            <p className="text-xs text-gray-500">
                              {new Date(submission.submissionDate).toLocaleString()} • 
                              Status: <span className={`font-medium ${
                                submission.status === 'correct' ? 'text-green-600' : 
                                submission.status === 'pending' ? 'text-amber-600' : 'text-red-600'
                              }`}>
                                {submission.status}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {codeSubmissions.length === 0 && (
                        <p className="text-center py-6 text-gray-500">
                          No recent activities
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="academic">
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Program Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-gray-500">Degree Program</p>
                        <p className="font-medium">Bachelor of Science in Computer Science</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-gray-500">Academic Year</p>
                        <p className="font-medium">2024-2025</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-gray-500">Expected Graduation</p>
                        <p className="font-medium">May 2026</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-gray-500">Academic Advisor</p>
                        <p className="font-medium">Dr. Emily Lawson</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Credits</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-gray-500">Credits Completed</p>
                        <p className="font-medium">45</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-gray-500">Credits In Progress</p>
                        <p className="font-medium">16</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-gray-500">Credits Required</p>
                        <p className="font-medium">120</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="email-notifications" 
                        className="w-4 h-4 rounded border-gray-300 text-lms-blue focus:ring-lms-blue"
                        defaultChecked
                      />
                      <label htmlFor="email-notifications" className="text-sm">
                        Receive email notifications for assignments and announcements
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="sms-notifications" 
                        className="w-4 h-4 rounded border-gray-300 text-lms-blue focus:ring-lms-blue"
                      />
                      <label htmlFor="sms-notifications" className="text-sm">
                        Receive SMS notifications for urgent announcements
                      </label>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Change Password</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input type="password" id="current-password" placeholder="•••••••••••" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input type="password" id="new-password" placeholder="•••••••••••" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input type="password" id="confirm-password" placeholder="•••••••••••" />
                    </div>
                    
                    <Button onClick={() => toast.success('Password updated successfully')}>
                      Update Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
