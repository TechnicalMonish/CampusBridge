
import React, { useState } from 'react';
import { BarChart, LineChart, PieChart, Activity, TrendingUp, Users, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bar, BarChart as ReChartsBarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart as ReChartsLineChart, Line, PieChart as ReChartsPieChart, Pie, Cell } from 'recharts';

const FacultyAnalytics: React.FC = () => {
  const { user } = useAuth();
  const { getInstructorCourses, assignments, codeSubmissions } = useData();
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  
  if (!user || user.role !== 'faculty') return null;
  
  const instructorName = user.name;
  const courses = getInstructorCourses(instructorName);
  
  const courseIds = selectedCourse === 'all' 
    ? courses.map(c => c.id) 
    : [parseInt(selectedCourse)];
  
  // Get all student IDs from the selected courses
  const studentIds = new Set<number>();
  courses
    .filter(course => courseIds.includes(course.id))
    .forEach(course => {
      (course.enrolledStudents || []).forEach(studentId => {
        studentIds.add(studentId);
      });
    });
  
  // Filter assignments by selected courses
  const courseAssignments = assignments.filter(a => 
    courseIds.includes(a.courseId)
  );
  
  // Filter code submissions by student IDs
  const studentCodeSubmissions = codeSubmissions.filter(sub => 
    studentIds.has(sub.studentId)
  );
  
  // Calculate assignment completion rate
  const assignmentCompletionData = courses.map(course => {
    const courseAssigns = assignments.filter(a => a.courseId === course.id);
    const totalSubmissions = courseAssigns.reduce((sum, a) => 
      sum + (a.submissions?.length || 0), 0
    );
    const totalPossible = courseAssigns.length * (course.enrolledStudents?.length || 0);
    
    return {
      name: course.code,
      completion: totalPossible ? Math.round((totalSubmissions / totalPossible) * 100) : 0
    };
  });
  
  // Calculate grade distribution
  const allGrades = courseAssignments.flatMap(a => 
    (a.submissions || [])
      .filter(s => s.grade !== undefined)
      .map(s => ({
        grade: s.grade!,
        max: a.points
      }))
  );
  
  const gradeDistribution = [
    { name: '90-100%', value: 0 },
    { name: '80-89%', value: 0 },
    { name: '70-79%', value: 0 },
    { name: '60-69%', value: 0 },
    { name: 'Below 60%', value: 0 }
  ];
  
  allGrades.forEach(({ grade, max }) => {
    const percentage = (grade / max) * 100;
    if (percentage >= 90) gradeDistribution[0].value++;
    else if (percentage >= 80) gradeDistribution[1].value++;
    else if (percentage >= 70) gradeDistribution[2].value++;
    else if (percentage >= 60) gradeDistribution[3].value++;
    else gradeDistribution[4].value++;
  });
  
  // Calculate coding performance
  const codingPerformance = Array.from(studentIds).map(id => {
    const submissions = studentCodeSubmissions.filter(s => s.studentId === id);
    return {
      id,
      total: submissions.length,
      correct: submissions.filter(s => s.status === 'correct').length
    };
  });
  
  const codingPerformanceData = [
    { name: '0 Problems', value: 0 },
    { name: '1-3 Problems', value: 0 },
    { name: '4-6 Problems', value: 0 },
    { name: '7+ Problems', value: 0 }
  ];
  
  codingPerformance.forEach(perf => {
    if (perf.total === 0) codingPerformanceData[0].value++;
    else if (perf.total <= 3) codingPerformanceData[1].value++;
    else if (perf.total <= 6) codingPerformanceData[2].value++;
    else codingPerformanceData[3].value++;
  });
  
  // Generate weekly activity data (mock data)
  const weeklyActivityData = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    weeklyActivityData.push({
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      assignments: Math.floor(Math.random() * 10),
      materials: Math.floor(Math.random() * 8),
      code: Math.floor(Math.random() * 5)
    });
  }
  
  // Colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <DashboardLayout requiredRole="faculty">
      <div className="dashboard-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="dashboard-title mb-4 md:mb-0">Student Analytics</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.code} - {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              Export Report
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Students</p>
                  <p className="text-2xl font-semibold">{studentIds.size}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Assignment Completion</p>
                  <p className="text-2xl font-semibold">
                    {assignmentCompletionData.reduce((sum, item) => sum + item.completion, 0) / 
                     Math.max(assignmentCompletionData.length, 1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Grade</p>
                  <p className="text-2xl font-semibold">
                    {allGrades.length 
                      ? Math.round(allGrades.reduce((sum, g) => sum + (g.grade / g.max * 100), 0) / allGrades.length)
                      : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Coding Success</p>
                  <p className="text-2xl font-semibold">
                    {codingPerformance.reduce((sum, p) => sum + p.correct, 0)} / {codingPerformance.reduce((sum, p) => sum + p.total, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="h-5 w-5 mr-2" />
                Assignment Completion by Course
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ReChartsBarChart
                    data={assignmentCompletionData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis unit="%" />
                    <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
                    <Bar dataKey="completion" fill="#3b82f6" name="Completion Rate" />
                  </ReChartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2" />
                Weekly Student Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ReChartsLineChart
                    data={weeklyActivityData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="assignments" stroke="#3b82f6" name="Assignments" />
                    <Line type="monotone" dataKey="materials" stroke="#10b981" name="Materials" />
                    <Line type="monotone" dataKey="code" stroke="#8b5cf6" name="Coding" />
                  </ReChartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Grade Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72 flex items-center justify-center">
                {allGrades.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ReChartsPieChart>
                      <Pie
                        data={gradeDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {gradeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </ReChartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-gray-500">
                    <p>No grade data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Coding Problem Completion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72 flex items-center justify-center">
                {studentCodeSubmissions.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ReChartsPieChart>
                      <Pie
                        data={codingPerformanceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {codingPerformanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </ReChartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-gray-500">
                    <p>No coding data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyAnalytics;
