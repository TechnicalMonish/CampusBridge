
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CheckCircle, XCircle, AlertCircle, BarChart4 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, parseISO } from 'date-fns';

const StudentAttendance = () => {
  const { user } = useAuth();
  const { getStudentCourses, getStudentAttendance } = useData();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  
  // Get student courses
  const courses = user?.id ? getStudentCourses(+user.id) : [];
  
  // Set initial selected course if no selection
  React.useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);
  
  // Get attendance records for selected course
  const attendanceRecords = user?.id && selectedCourseId 
    ? getStudentAttendance(+user.id, selectedCourseId)
    : [];
  
  // Calculate attendance statistics
  const totalClasses = attendanceRecords.length;
  const presentCount = attendanceRecords.filter(record => record.status === 'present').length;
  const absentCount = attendanceRecords.filter(record => record.status === 'absent').length;
  const lateCount = attendanceRecords.filter(record => record.status === 'late').length;
  
  const attendanceRate = totalClasses > 0 
    ? Math.round((presentCount / totalClasses) * 100) 
    : 0;
  
  // Format attendance data for chart
  const chartData = [
    { name: 'Present', value: presentCount, color: '#22c55e' },
    { name: 'Late', value: lateCount, color: '#f59e0b' },
    { name: 'Absent', value: absentCount, color: '#ef4444' }
  ];
  
  // Get selected course
  const selectedCourse = courses.find(course => course.id === selectedCourseId);
  
  if (!user) return null;
  
  return (
    <DashboardLayout requiredRole="student">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Attendance Records</h1>
        
        <div className="mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="sm:flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Select Course</h2>
                  <p className="text-gray-500 text-sm mb-4 sm:mb-0">View your attendance records by course</p>
                </div>
                <div className="w-full sm:w-auto">
                  <Select 
                    value={selectedCourseId?.toString() || ''} 
                    onValueChange={(value) => setSelectedCourseId(parseInt(value))}
                  >
                    <SelectTrigger className="w-full sm:w-[250px]">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.code}: {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {selectedCourse ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-lms-blue-light text-lms-blue mr-4">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Classes</p>
                    <p className="text-2xl font-semibold">{totalClasses}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Present</p>
                    <p className="text-2xl font-semibold">{presentCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Late</p>
                    <p className="text-2xl font-semibold">{lateCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                    <XCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Absent</p>
                    <p className="text-2xl font-semibold">{absentCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
        
        {selectedCourse && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedCourse.title}</CardTitle>
                    <CardDescription>{selectedCourse.code}</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Attendance Rate</p>
                    <p className={`text-xl font-bold ${
                      attendanceRate >= 80 ? 'text-green-600' : 
                      attendanceRate >= 60 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {attendanceRate}%
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {attendanceRecords.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left p-3 text-sm font-medium text-gray-500">Date</th>
                          <th className="text-left p-3 text-sm font-medium text-gray-500">Day</th>
                          <th className="text-left p-3 text-sm font-medium text-gray-500">Status</th>
                          <th className="text-right p-3 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {attendanceRecords
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map(record => {
                            const date = parseISO(record.date);
                            return (
                              <tr key={record.id} className="hover:bg-gray-50">
                                <td className="p-3">{format(date, 'MMM dd, yyyy')}</td>
                                <td className="p-3">{format(date, 'EEEE')}</td>
                                <td className="p-3">
                                  <div className="flex items-center">
                                    {record.status === 'present' && (
                                      <>
                                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                        <span className="text-green-600 font-medium">Present</span>
                                      </>
                                    )}
                                    {record.status === 'late' && (
                                      <>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                                        <span className="text-yellow-600 font-medium">Late</span>
                                      </>
                                    )}
                                    {record.status === 'absent' && (
                                      <>
                                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                        <span className="text-red-600 font-medium">Absent</span>
                                      </>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3 text-right">
                                  {record.status === 'absent' && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => alert('Request excuse form')}
                                    >
                                      Request Excuse
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Attendance Records</h3>
                    <p className="text-gray-500 max-w-sm">
                      There are no attendance records for this course yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart4 className="mr-2 h-5 w-5" />
                  Attendance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {totalClasses > 0 ? (
                  <>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="value">
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-6 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span>Present</span>
                        </div>
                        <span>{Math.round((presentCount / totalClasses) * 100)}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                          <span>Late</span>
                        </div>
                        <span>{Math.round((lateCount / totalClasses) * 100)}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          <span>Absent</span>
                        </div>
                        <span>{Math.round((absentCount / totalClasses) * 100)}%</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <BarChart4 className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">
                      No data available for attendance summary
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentAttendance;
