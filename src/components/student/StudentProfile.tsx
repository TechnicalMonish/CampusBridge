
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import ProfileEditor from '@/components/student/ProfileEditor';

interface User {
  id: string | number; // Updated to accept both string and number
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
}

interface StudentProfileProps {
  user: User;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ user }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center text-center mb-4">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={user.avatar || ''} />
            <AvatarFallback className="text-lg">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-medium text-lg">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-sm mt-2">{user.bio || 'Computer Science student'}</p>
        </div>
        <Separator className="my-4" />
        <ProfileEditor />
      </CardContent>
    </Card>
  );
};

export default StudentProfile;
