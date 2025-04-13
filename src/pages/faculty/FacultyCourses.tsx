
import React, { useState } from 'react';
import { BookOpen, PlusCircle, Search, Users, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CourseCard from '@/components/ui/CourseCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const FacultyCourses: React.FC = () => {
  const { user } = useAuth();
  const { getInstructorCourses } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!user || user.role !== 'faculty') return null;
  
  const instructorName = user.name;
  const allCourses = getInstructorCourses(instructorName);
  const courses = allCourses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <DashboardLayout requiredRole="faculty">
      <div className="dashboard-container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="dashboard-title mb-4 sm:mb-0">My Courses</h1>
          <Button className="bg-lms-blue hover:bg-lms-blue-dark">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Course
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-10"
              placeholder="Search courses by title or code..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Courses</p>
                  <p className="text-2xl font-semibold">{allCourses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Students</p>
                  <p className="text-2xl font-semibold">
                    {allCourses.reduce((sum, course) => sum + (course.enrolledStudents?.length || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Semester</p>
                  <p className="text-2xl font-semibold">Spring 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <section>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} userRole="faculty" />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium mb-2">No courses found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery ? 'No courses match your search criteria' : 'You have not created any courses yet'}
                </p>
                {!searchQuery && (
                  <Button className="bg-lms-blue hover:bg-lms-blue-dark">
                    Create Your First Course
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default FacultyCourses;
