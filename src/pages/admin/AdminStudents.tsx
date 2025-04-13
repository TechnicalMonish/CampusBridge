
import React, { useState } from 'react';
import { Users, Search, Filter, Plus, Edit, Trash2, BookOpen, Mail, BarChart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const AdminStudents: React.FC = () => {
  const { user } = useAuth();
  const { courses, assignments, attendance } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  
  if (!user || user.role !== 'admin') return null;
  
  // Extract student IDs from all courses
  const studentIds = new Set<number>();
  courses.forEach(course => {
    course.enrolledStudents?.forEach(id => studentIds.add(id));
  });
  
  // Mock student data with basic information
  const mockStudents = Array.from(studentIds).map(id => {
    // Create mock student data
    const student = {
      id,
      name: `Student #${id}`,
      email: `student${id}@example.com`,
      year: Math.floor(Math.random() * 4) + 1, // Year 1-4
      department: ['CS', 'MATH', 'ENG', 'BUS'][Math.floor(Math.random() * 4)],
      enrolledCourses: courses.filter(course => course.enrolledStudents?.includes(id)),
      // Performance metrics
      attendance: {
        total: 0,
        present: 0,
        rate: 0
      },
      assignments: {
        total: 0,
        submitted: 0,
        rate: 0,
        avgGrade: 0
      }
    };
    
    // Calculate attendance rate
    const studentAttendance = attendance.filter(a => a.studentId === id);
    const presentCount = studentAttendance.filter(a => a.status === 'present').length;
    student.attendance = {
      total: studentAttendance.length,
      present: presentCount,
      rate: studentAttendance.length > 0 ? Math.round((presentCount / studentAttendance.length) * 100) : 0
    };
    
    // Calculate assignment stats
    const courseIds = student.enrolledCourses.map(course => course.id);
    const studentAssignments = assignments.filter(a => courseIds.includes(a.courseId));
    const submittedAssignments = studentAssignments.filter(a => 
      a.submissions?.some(sub => sub.studentId === id)
    );
    
    // Calculate average grade
    let totalGrade = 0;
    let countGraded = 0;
    submittedAssignments.forEach(a => {
      const submission = a.submissions?.find(sub => sub.studentId === id);
      if (submission && submission.grade !== undefined) {
        totalGrade += (submission.grade / a.points) * 100;
        countGraded++;
      }
    });
    
    student.assignments = {
      total: studentAssignments.length,
      submitted: submittedAssignments.length,
      rate: studentAssignments.length > 0 ? Math.round((submittedAssignments.length / studentAssignments.length) * 100) : 0,
      avgGrade: countGraded > 0 ? Math.round(totalGrade / countGraded) : 0
    };
    
    return student;
  });
  
  // Filter students
  let filteredStudents = [...mockStudents];
  
  // Apply search filter
  if (searchQuery) {
    filteredStudents = filteredStudents.filter(student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Apply year filter
  if (yearFilter !== 'all') {
    const yearNum = parseInt(yearFilter);
    filteredStudents = filteredStudents.filter(student => student.year === yearNum);
  }
  
  return (
    <DashboardLayout requiredRole="admin">
      <div className="dashboard-container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="dashboard-title mb-4 sm:mb-0">Student Management</h1>
          <Button className="bg-lms-blue hover:bg-lms-blue-dark">
            <Plus className="h-4 w-4 mr-2" />
            Add New Student
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Students</p>
                  <p className="text-2xl font-semibold">{mockStudents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Course Load</p>
                  <p className="text-2xl font-semibold">
                    {(mockStudents.reduce((sum, s) => sum + s.enrolledCourses.length, 0) / Math.max(mockStudents.length, 1)).toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <BarChart className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Assignment Grade</p>
                  <p className="text-2xl font-semibold">
                    {Math.round(mockStudents.reduce((sum, s) => sum + s.assignments.avgGrade, 0) / Math.max(mockStudents.length, 1))}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Attendance</p>
                  <p className="text-2xl font-semibold">
                    {Math.round(mockStudents.reduce((sum, s) => sum + s.attendance.rate, 0) / Math.max(mockStudents.length, 1))}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Student Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  className="pl-10"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="1">Year 1</SelectItem>
                    <SelectItem value="2">Year 2</SelectItem>
                    <SelectItem value="3">Year 3</SelectItem>
                    <SelectItem value="4">Year 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Student List ({filteredStudents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium">ID</th>
                    <th className="px-4 py-3 text-left font-medium">Student</th>
                    <th className="px-4 py-3 text-left font-medium">Department</th>
                    <th className="px-4 py-3 text-left font-medium">Year</th>
                    <th className="px-4 py-3 text-left font-medium">Courses</th>
                    <th className="px-4 py-3 text-left font-medium">Attendance</th>
                    <th className="px-4 py-3 text-left font-medium">Assignment Grade</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{student.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-lms-blue-light text-lms-blue text-sm">
                              {student.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{student.department}</Badge>
                      </td>
                      <td className="px-4 py-3">Year {student.year}</td>
                      <td className="px-4 py-3">{student.enrolledCourses.length}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className="mr-2">{student.attendance.rate}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${student.attendance.rate}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className="mr-2">{student.assignments.avgGrade}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                student.assignments.avgGrade >= 90 ? 'bg-green-600' :
                                student.assignments.avgGrade >= 70 ? 'bg-blue-600' :
                                student.assignments.avgGrade >= 50 ? 'bg-yellow-600' :
                                'bg-red-600'
                              }`}
                              style={{ width: `${student.assignments.avgGrade}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        No students found matching your filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminStudents;
