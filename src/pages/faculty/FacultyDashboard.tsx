
import React from 'react';
import { BookOpen, FileText, Users, BarChart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/ui/StatsCard';
import CourseCard from '@/components/ui/CourseCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    getInstructorCourses, 
    assignments,
    materials
  } = useData();
  
  if (!user || user.role !== 'faculty') return null;
  
  const instructorName = user.name;
  const courses = getInstructorCourses(instructorName);
  
  // Calculate some stats
  const totalStudents = courses.reduce((sum, course) => 
    sum + (course.enrolledStudents?.length || 0), 0);
  
  const courseAssignments = assignments.filter(a => 
    courses.some(c => c.id === a.courseId)
  );
  
  const courseMaterials = materials.filter(m => 
    courses.some(c => c.id === m.courseId)
  );
  
  const totalSubmissions = courseAssignments.reduce(
    (sum, assignment) => sum + (assignment.submissions?.length || 0), 0
  );
  
  return (
    <DashboardLayout requiredRole="faculty">
      <div className="dashboard-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="dashboard-title mb-0">Welcome, {instructorName}</h1>
          <Button className="bg-lms-blue hover:bg-lms-blue-dark">
            Create New Course
          </Button>
        </div>
        
        {/* Stats Overview */}
        <section className="dashboard-section">
          <h2 className="section-title">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Active Courses"
              value={courses.length}
              icon={<BookOpen className="h-6 w-6" />}
            />
            <StatsCard
              title="Total Students"
              value={totalStudents}
              icon={<Users className="h-6 w-6" />}
            />
            <StatsCard
              title="Course Materials"
              value={courseMaterials.length}
              icon={<FileText className="h-6 w-6" />}
            />
            <StatsCard
              title="Assignment Submissions"
              value={totalSubmissions}
              icon={<BarChart className="h-6 w-6" />}
            />
          </div>
        </section>
        
        {/* Your Courses */}
        <section className="dashboard-section">
          <h2 className="section-title">Your Courses</h2>
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
                <h3 className="text-xl font-medium mb-2">No courses yet</h3>
                <p className="text-gray-500 mb-6">You haven't created any courses yet.</p>
                <Button className="bg-lms-blue hover:bg-lms-blue-dark">
                  Create Your First Course
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
        
        {/* Recent Student Activity */}
        <section className="dashboard-section">
          <h2 className="section-title">Recent Student Activity</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assignment Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {courseAssignments
                  .flatMap(assignment => 
                    (assignment.submissions || []).map(submission => ({
                      assignment,
                      submission,
                      courseName: courses.find(c => c.id === assignment.courseId)?.title || ''
                    }))
                  )
                  .sort((a, b) => 
                    new Date(b.submission.submissionDate).getTime() - 
                    new Date(a.submission.submissionDate).getTime()
                  )
                  .slice(0, 5)
                  .map((item, index) => (
                    <li key={index} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{item.assignment.title}</h3>
                          <p className="text-sm text-gray-500">
                            Student #{item.submission.studentId} - {item.courseName}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-lms-blue">
                            {new Date(item.submission.submissionDate).toLocaleDateString()}
                          </span>
                          <p className="text-sm text-gray-500">
                            {item.submission.grade 
                              ? `Graded: ${item.submission.grade}/${item.assignment.points}` 
                              : 'Not graded'}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                
                {courseAssignments.flatMap(a => a.submissions || []).length === 0 && (
                  <li className="py-10 text-center">
                    <p className="text-gray-500">No recent submissions from students.</p>
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

export default FacultyDashboard;
