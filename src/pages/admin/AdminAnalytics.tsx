
import React, { useState } from 'react';
import { BarChart, PieChart, Activity, TrendingUp, Users, Award, BookOpen, LineChart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bar, BarChart as ReChartsBarChart, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart as ReChartsLineChart, Line, PieChart as ReChartsPieChart, Pie, Cell } from 'recharts';

const AdminAnalytics: React.FC = () => {
  const { user } = useAuth();
  const { courses, assignments, codeSubmissions, attendance } = useData();
  const [timeframe, setTimeframe] = useState('semester');
  
  if (!user || user.role !== 'admin') return null;
  
  // Extract all student IDs from courses
  const studentIds = new Set<number>();
  courses.forEach(course => {
    course.enrolledStudents?.forEach(id => studentIds.add(id));
  });
  
  // Mock data for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Course enrollment distribution
  const enrollmentData = courses.map(course => ({
    name: course.code,
    students: course.enrolledStudents?.length || 0
  })).sort((a, b) => b.students - a.students).slice(0, 5);
  
  // Department distribution
  const departmentMap = new Map<string, number>();
  courses.forEach(course => {
    const dept = course.code.split(' ')[0];
    departmentMap.set(dept, (departmentMap.get(dept) || 0) + (course.enrolledStudents?.length || 0));
  });
  
  const departmentData = Array.from(departmentMap.entries()).map(([name, value]) => ({
    name, value
  })).sort((a, b) => b.value - a.value);
  
  // Assignment completion rate by department
  const assignmentCompletionByDept = Array.from(departmentMap.keys()).map(dept => {
    const deptCourses = courses.filter(c => c.code.startsWith(dept));
    const courseIds = deptCourses.map(c => c.id);
    const deptAssignments = assignments.filter(a => courseIds.includes(a.courseId));
    
    const totalPossible = deptAssignments.reduce((sum, a) => {
      const courseEnrollment = courses.find(c => c.id === a.courseId)?.enrolledStudents?.length || 0;
      return sum + courseEnrollment;
    }, 0);
    
    const totalSubmitted = deptAssignments.reduce((sum, a) => sum + (a.submissions?.length || 0), 0);
    
    return {
      name: dept,
      completion: totalPossible ? Math.round((totalSubmitted / totalPossible) * 100) : 0
    };
  });
  
  // Grade distribution
  const allGrades = assignments.flatMap(a => 
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
  
  // Coding problems by language
  const languageMap = new Map<string, number>();
  codeSubmissions.forEach(submission => {
    languageMap.set(submission.language, (languageMap.get(submission.language) || 0) + 1);
  });
  
  const languageData = Array.from(languageMap.entries()).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize
    value
  }));
  
  // Monthly attendance data (mock)
  const monthlyAttendanceData = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  for (let i = 0; i < 6; i++) {
    const monthIndex = (currentMonth - i + 12) % 12;
    monthlyAttendanceData.unshift({
      month: months[monthIndex],
      rate: Math.floor(Math.random() * 15) + 80 // Random attendance rate between 80-95%
    });
  }
  
  return (
    <DashboardLayout requiredRole="admin">
      <div className="dashboard-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="dashboard-title mb-4 md:mb-0">Academic Analytics</h1>
          <div className="flex gap-4">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semester">Current Semester</SelectItem>
                <SelectItem value="year">Academic Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
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
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Courses</p>
                  <p className="text-2xl font-semibold">{courses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Attendance</p>
                  <p className="text-2xl font-semibold">
                    {attendance.length > 0
                      ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100)
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
        </div>
        
        <Tabs defaultValue="enrollment" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="coding">Coding</TabsTrigger>
          </TabsList>
          
          <TabsContent value="enrollment" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2" />
                    Top Courses by Enrollment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReChartsBarChart
                        data={enrollmentData}
                        margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
                        <RechartsTooltip />
                        <Bar dataKey="students" fill="#3b82f6" name="Students" />
                      </ReChartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Enrollment by Department
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReChartsPieChart>
                        <Pie
                          data={departmentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </ReChartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2" />
                    Assignment Completion by Department
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReChartsBarChart
                        data={assignmentCompletionByDept}
                        margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis unit="%" />
                        <RechartsTooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
                        <Bar dataKey="completion" fill="#3b82f6" name="Completion Rate" />
                      </ReChartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Grade Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
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
                        <RechartsTooltip />
                      </ReChartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2" />
                  Monthly Attendance Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReChartsLineChart
                      data={monthlyAttendanceData}
                      margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} unit="%" />
                      <RechartsTooltip formatter={(value) => [`${value}%`, 'Attendance Rate']} />
                      <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={2} />
                    </ReChartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="coding" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Programming Languages Used
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReChartsPieChart>
                        <Pie
                          data={languageData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {languageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </ReChartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2" />
                    Code Submission Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReChartsBarChart
                        data={[
                          { name: 'Correct', value: codeSubmissions.filter(s => s.status === 'correct').length },
                          { name: 'Incorrect', value: codeSubmissions.filter(s => s.status === 'incorrect').length },
                          { name: 'Pending', value: codeSubmissions.filter(s => s.status === 'pending').length }
                        ]}
                        margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="value" name="Submissions">
                          <Cell fill="#10b981" />
                          <Cell fill="#ef4444" />
                          <Cell fill="#f59e0b" />
                        </Bar>
                      </ReChartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
