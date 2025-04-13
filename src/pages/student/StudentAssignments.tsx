
import React from 'react';
import { FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AIAssistant from '@/components/student/AIAssistant';

const StudentAssignments: React.FC = () => {
  const { user } = useAuth();
  const { getStudentCourses, assignments } = useData();
  
  if (!user || user.role !== 'student') return null;
  
  const studentId = user.id;
  const courses = getStudentCourses(studentId);
  
  // Get all assignments for the student's courses
  const studentAssignments = assignments.filter(assignment => 
    courses.some(course => course.id === assignment.courseId)
  );
  
  // Split assignments into upcoming and completed
  const upcomingAssignments = studentAssignments.filter(assignment => 
    !assignment.submissions?.some(sub => sub.studentId === studentId)
  );
  
  const completedAssignments = studentAssignments.filter(assignment => 
    assignment.submissions?.some(sub => sub.studentId === studentId)
  );
  
  return (
    <DashboardLayout requiredRole="student">
      <div className="dashboard-container">
        <h1 className="dashboard-title">My Assignments</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAssignments.length > 0 ? (
                <ul className="divide-y">
                  {upcomingAssignments.map(assignment => {
                    const course = courses.find(c => c.id === assignment.courseId);
                    return (
                      <li key={assignment.id} className="py-4 first:pt-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{assignment.title}</h3>
                            <p className="text-sm text-gray-500">
                              {course?.code} - {course?.title}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-red-500">
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">{assignment.description?.substring(0, 120)}...</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{assignment.points} points</span>
                          <Button size="sm">Start Assignment</Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="py-8 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">No upcoming assignments</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Completed Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Completed Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              {completedAssignments.length > 0 ? (
                <ul className="divide-y">
                  {completedAssignments.map(assignment => {
                    const course = courses.find(c => c.id === assignment.courseId);
                    const submission = assignment.submissions?.find(
                      sub => sub.studentId === studentId
                    );
                    
                    return (
                      <li key={assignment.id} className="py-4 first:pt-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{assignment.title}</h3>
                            <p className="text-sm text-gray-500">
                              {course?.code} - {course?.title}
                            </p>
                          </div>
                          <Badge variant={submission?.grade ? "default" : "secondary"} 
                            className={submission?.grade ? "bg-green-100 text-green-800" : ""}>
                            {submission?.grade 
                              ? `${submission.grade}/${assignment.points}` 
                              : "Submitted"}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Submitted: {new Date(submission?.submissionDate || '').toLocaleDateString()}</span>
                          <Button size="sm" variant="outline">View Submission</Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="py-8 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">No completed assignments</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <AIAssistant 
          studentSkills={['React', 'JavaScript', 'Python', 'C++', 'Java']} 
          studentName={user.name}
        />
      </div>
    </DashboardLayout>
  );
};

export default StudentAssignments;
