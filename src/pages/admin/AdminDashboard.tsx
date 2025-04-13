
import React from 'react';
import { BookOpen, GraduationCap, Users, BarChart, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/ui/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    courses, 
    codeSubmissions
  } = useData();
  
  if (!user || user.role !== 'admin') return null;
  
  // Calculate some stats
  const totalStudents = new Set(courses.flatMap(c => c.enrolledStudents || [])).size;
  const totalInstructors = new Set(courses.map(c => c.instructor)).size;
  const totalCourses = courses.length;
  
  // Sample data for charts (would be calculated in a real app)
  const skillMetrics = [
    { skill: 'Programming', score: 78 },
    { skill: 'Data Structures', score: 65 },
    { skill: 'Algorithms', score: 72 },
    { skill: 'Database', score: 58 },
    { skill: 'Web Development', score: 81 }
  ];
  
  const placementReadiness = {
    overall: 72,
    technical: 68,
    softSkills: 75,
    projects: 80
  };
  
  return (
    <DashboardLayout requiredRole="admin">
      <div className="dashboard-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="dashboard-title mb-0">Admin Dashboard</h1>
          <div className="flex gap-3">
            <Button variant="outline">Export Reports</Button>
            <Button className="bg-lms-blue hover:bg-lms-blue-dark">Manage Users</Button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <section className="dashboard-section">
          <h2 className="section-title">Institution Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Students"
              value={totalStudents}
              trend={{ value: 12, isPositive: true }}
              description="from last month"
              icon={<Users className="h-6 w-6" />}
            />
            <StatsCard
              title="Total Faculty"
              value={totalInstructors}
              trend={{ value: 5, isPositive: true }}
              description="from last month"
              icon={<GraduationCap className="h-6 w-6" />}
            />
            <StatsCard
              title="Active Courses"
              value={totalCourses}
              trend={{ value: 8, isPositive: true }}
              description="from last semester"
              icon={<BookOpen className="h-6 w-6" />}
            />
            <StatsCard
              title="Placement Readiness"
              value={`${placementReadiness.overall}%`}
              trend={{ value: 3, isPositive: true }}
              description="from last batch"
              icon={<Briefcase className="h-6 w-6" />}
            />
          </div>
        </section>
        
        {/* Placement and Skills Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 dashboard-section">
          {/* Skills Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aggregate Skill Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillMetrics.map(skill => (
                  <div key={skill.skill}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{skill.skill}</span>
                      <span className="text-sm font-medium">{skill.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-lms-blue h-2.5 rounded-full" 
                        style={{ width: `${skill.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Placement Readiness */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Placement Readiness Index</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-6">
                <div className="relative w-36 h-36">
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
                      stroke="#2196F3"
                      strokeWidth="3"
                      strokeDasharray={`${placementReadiness.overall}, 100`}
                    />
                    <text x="18" y="20.5" className="text-3xl font-bold" textAnchor="middle" fill="#333">
                      {placementReadiness.overall}%
                    </text>
                  </svg>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Technical</p>
                  <p className="text-lg font-semibold">{placementReadiness.technical}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Soft Skills</p>
                  <p className="text-lg font-semibold">{placementReadiness.softSkills}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Projects</p>
                  <p className="text-lg font-semibold">{placementReadiness.projects}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Coding Leaderboard */}
        <section className="dashboard-section">
          <h2 className="section-title">Coding Leaderboard</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-6 py-3 text-left font-medium text-gray-500">Rank</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500">Student ID</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500">Problems Solved</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500">Languages</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500">Success Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {Array.from(
                      codeSubmissions.reduce((acc, submission) => {
                        if (!acc.has(submission.studentId)) {
                          acc.set(submission.studentId, {
                            id: submission.studentId,
                            solved: new Set(),
                            languages: new Set(),
                            correct: 0,
                            total: 0
                          });
                        }
                        
                        const student = acc.get(submission.studentId)!;
                        student.solved.add(submission.problemId);
                        student.languages.add(submission.language);
                        student.total++;
                        if (submission.status === 'correct') student.correct++;
                        
                        return acc;
                      }, new Map())
                    )
                    .map(([id, stats]) => ({
                      id,
                      problemsSolved: stats.solved.size,
                      languages: Array.from(stats.languages),
                      successRate: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
                    }))
                    .sort((a, b) => b.problemsSolved - a.problemsSolved)
                    .map((student, index) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4">Student #{student.id}</td>
                        <td className="px-6 py-4">{student.problemsSolved}</td>
                        <td className="px-6 py-4 capitalize">{student.languages.join(', ')}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="mr-2">{student.successRate}%</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-lms-teal h-2 rounded-full" 
                                style={{ width: `${student.successRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
