
import React from 'react';
import { GraduationCap, BookOpen, FileText, Users, Code } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/ui/StatsCard';
import CourseCard from '@/components/ui/CourseCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    getStudentCourses, 
    getStudentCodeSubmissions,
    assignments,
    attendance
  } = useData();
  
  if (!user || user.role !== 'student') return null;
  
  const studentId = user.id;
  const courses = getStudentCourses(studentId);
  const codeSubmissions = getStudentCodeSubmissions(studentId);
  
  // Calculate some stats
  const totalAssignments = assignments.filter(a => 
    courses.some(c => c.id === a.courseId)
  ).length;
  
  const completedAssignments = assignments.filter(a => 
    a.submissions?.some(s => s.studentId === studentId)
  ).length;
  
  const attendanceRecords = attendance.filter(a => a.studentId === studentId);
  const presentCount = attendanceRecords.filter(a => a.status === 'present').length;
  const attendanceRate = attendanceRecords.length > 0 
    ? Math.round((presentCount / attendanceRecords.length) * 100) 
    : 0;
  
  return (
    <DashboardLayout requiredRole="student">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Welcome back, {user.name}</h1>
        
        {/* Stats Overview */}
        <section className="dashboard-section">
          <h2 className="section-title">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Enrolled Courses"
              value={courses.length}
              icon={<BookOpen className="h-6 w-6" />}
            />
            <StatsCard
              title="Assignments"
              value={`${completedAssignments}/${totalAssignments}`}
              description="completed"
              icon={<FileText className="h-6 w-6" />}
            />
            <StatsCard
              title="Attendance"
              value={`${attendanceRate}%`}
              description="average"
              icon={<Users className="h-6 w-6" />}
            />
            <StatsCard
              title="Coding Practice"
              value={codeSubmissions.length}
              description="problems solved"
              icon={<Code className="h-6 w-6" />}
            />
          </div>
        </section>
        
        {/* Recent Courses */}
        <section className="dashboard-section">
          <h2 className="section-title">Your Courses</h2>
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
        
        {/* Upcoming Assignments */}
        <section className="dashboard-section">
          <h2 className="section-title">Upcoming Assignments</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Due This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {assignments
                  .filter(a => 
                    courses.some(c => c.id === a.courseId) && 
                    !a.submissions?.some(s => s.studentId === studentId)
                  )
                  .slice(0, 3)
                  .map(assignment => (
                    <li key={assignment.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{assignment.title}</h3>
                          <p className="text-sm text-gray-500">
                            {courses.find(c => c.id === assignment.courseId)?.code} - 
                            {courses.find(c => c.id === assignment.courseId)?.title}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-red-500">
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </span>
                          <p className="text-sm text-gray-500">{assignment.points} points</p>
                        </div>
                      </div>
                    </li>
                  ))}
                
                {assignments.filter(a => 
                  courses.some(c => c.id === a.courseId) && 
                  !a.submissions?.some(s => s.studentId === studentId)
                ).length === 0 && (
                  <li className="py-10 text-center">
                    <p className="text-gray-500">No upcoming assignments. You're all caught up!</p>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
