
import React from 'react';
import { BookOpen, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CourseCard from '@/components/ui/CourseCard';
import { Card, CardContent } from '@/components/ui/card';

const StudentCourses: React.FC = () => {
  const { user } = useAuth();
  const { getStudentCourses } = useData();
  
  if (!user || user.role !== 'student') return null;
  
  const studentId = user.id;
  const courses = getStudentCourses(studentId);
  
  return (
    <DashboardLayout requiredRole="student">
      <div className="dashboard-container">
        <h1 className="dashboard-title">My Courses</h1>
        
        <section className="dashboard-section">
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} userRole="student" />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium mb-2">No courses yet</h3>
                <p className="text-gray-500">You are not enrolled in any courses.</p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default StudentCourses;
