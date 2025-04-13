
import React, { useState } from 'react';
import { GraduationCap, Search, Filter, Plus, Edit, Trash2, BookOpen, Mail, BarChart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const AdminFaculty: React.FC = () => {
  const { user } = useAuth();
  const { courses } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!user || user.role !== 'admin') return null;
  
  // Extract unique faculty members from courses
  const getAllFaculty = () => {
    const facultyMap = new Map();
    
    courses.forEach(course => {
      if (!facultyMap.has(course.instructor)) {
        facultyMap.set(course.instructor, {
          name: course.instructor,
          courses: [],
          students: new Set(),
          department: course.code.split(' ')[0] // Assume first part of course code is department
        });
      }
      
      const faculty = facultyMap.get(course.instructor);
      faculty.courses.push(course);
      course.enrolledStudents?.forEach(studentId => {
        faculty.students.add(studentId);
      });
    });
    
    return Array.from(facultyMap.values());
  };
  
  const faculty = getAllFaculty();
  
  // Filter faculty based on search
  const filteredFaculty = faculty.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.department.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <DashboardLayout requiredRole="admin">
      <div className="dashboard-container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="dashboard-title mb-4 sm:mb-0">Faculty Management</h1>
          <Button className="bg-lms-blue hover:bg-lms-blue-dark">
            <Plus className="h-4 w-4 mr-2" />
            Add New Faculty
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Faculty</p>
                  <p className="text-2xl font-semibold">{faculty.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Course Load</p>
                  <p className="text-2xl font-semibold">
                    {(faculty.reduce((sum, f) => sum + f.courses.length, 0) / Math.max(faculty.length, 1)).toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <BarChart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Departments</p>
                  <p className="text-2xl font-semibold">
                    {new Set(faculty.map(f => f.department)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                className="pl-10"
                placeholder="Search faculty by name or department..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((faculty, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-lms-blue text-white text-lg">
                      {faculty.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-1">{faculty.name}</h3>
                    <Badge className="mb-3">{faculty.department}</Badge>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Courses</p>
                        <p className="font-medium">{faculty.courses.length}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Students</p>
                        <p className="font-medium">{faculty.students.size}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="ghost" className="flex-1">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                      <Button size="sm" variant="ghost" className="flex-1">
                        <BarChart className="h-4 w-4 mr-2" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Courses Teaching</h4>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {faculty.courses.map(course => (
                      <div key={course.id} className="text-sm flex justify-between">
                        <span>{course.code}</span>
                        <span className="text-gray-500">{course.enrolledStudents?.length || 0} students</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredFaculty.length === 0 && (
            <Card className="lg:col-span-3">
              <CardContent className="py-10 text-center">
                <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium mb-2">No faculty found</h3>
                <p className="text-gray-500">
                  {searchQuery ? 'No faculty match your search criteria' : 'There are no faculty members in the system yet'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminFaculty;
