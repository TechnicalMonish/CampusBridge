
import React from 'react';
import { Users, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const StudentAttendance: React.FC = () => {
  const { user } = useAuth();
  const { attendance, getStudentCourses } = useData();
  
  if (!user || user.role !== 'student') return null;
  
  const studentId = user.id;
  const courses = getStudentCourses(studentId);
  const studentAttendance = attendance.filter(a => a.studentId === studentId);
  
  // Calculate attendance rate
  const attendanceRate = studentAttendance.length > 0 
    ? Math.round((studentAttendance.filter(a => a.status === 'present').length / studentAttendance.length) * 100) 
    : 0;
  
  // Group attendance by course
  const attendanceByMonth: Record<string, typeof studentAttendance> = {};
  
  studentAttendance.forEach(record => {
    const date = new Date(record.date);
    const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    
    if (!attendanceByMonth[monthYear]) {
      attendanceByMonth[monthYear] = [];
    }
    
    attendanceByMonth[monthYear].push(record);
  });
  
  return (
    <DashboardLayout requiredRole="student">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Attendance Records</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Overall Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeDasharray={`${attendanceRate}, 100`}
                    />
                    <text x="18" y="20.5" className="text-3xl font-bold" textAnchor="middle" fill="#333">
                      {attendanceRate}%
                    </text>
                  </svg>
                </div>
              </div>
              <div className="flex justify-center mt-4 space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Present: {studentAttendance.filter(a => a.status === 'present').length}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">Absent: {studentAttendance.filter(a => a.status === 'absent').length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Course-wise Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map(course => {
                  const courseAttendance = studentAttendance.filter(a => a.courseId === course.id);
                  const courseAttendanceRate = courseAttendance.length > 0 
                    ? Math.round((courseAttendance.filter(a => a.status === 'present').length / courseAttendance.length) * 100) 
                    : 0;
                  
                  return (
                    <div key={course.id}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{course.title}</span>
                        <span className="text-sm font-medium">{courseAttendanceRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${courseAttendanceRate}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
                
                {courses.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No course attendance data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Monthly attendance records */}
        <div className="space-y-6">
          {Object.entries(attendanceByMonth).length > 0 ? (
            Object.entries(attendanceByMonth).map(([month, records]) => (
              <Card key={month}>
                <CardHeader>
                  <CardTitle className="text-lg">{month}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left pb-2 font-medium">Date</th>
                          <th className="text-left pb-2 font-medium">Course</th>
                          <th className="text-left pb-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {records.map((record, index) => {
                          const course = courses.find(c => c.id === record.courseId);
                          return (
                            <tr key={index}>
                              <td className="py-3">{new Date(record.date).toLocaleDateString()}</td>
                              <td className="py-3">{course?.title || 'Unknown Course'}</td>
                              <td className="py-3">
                                {record.status === 'present' ? (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                    <CheckCircle className="w-4 h-4 mr-1" /> Present
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                    <XCircle className="w-4 h-4 mr-1" /> Absent
                                  </Badge>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium mb-2">No attendance records</h3>
                <p className="text-gray-500">Your attendance records will appear here</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentAttendance;
