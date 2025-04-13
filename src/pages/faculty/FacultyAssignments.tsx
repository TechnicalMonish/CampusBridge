
import React, { useState } from 'react';
import { FileText, PlusCircle, Calendar, CheckCircle, Clock, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const FacultyAssignments: React.FC = () => {
  const { user } = useAuth();
  const { getInstructorCourses, assignments } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!user || user.role !== 'faculty') return null;
  
  const instructorName = user.name;
  const courses = getInstructorCourses(instructorName);
  
  // Filter assignments for instructor's courses
  const instructorAssignments = assignments.filter(assignment => 
    courses.some(course => course.id === assignment.courseId)
  );
  
  // Filter assignments based on search
  const filteredAssignments = instructorAssignments.filter(assignment => 
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    courses.find(course => course.id === assignment.courseId)?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate due dates and status
  const now = new Date();
  const upcoming = filteredAssignments.filter(a => new Date(a.dueDate) > now);
  const past = filteredAssignments.filter(a => new Date(a.dueDate) <= now);
  
  return (
    <DashboardLayout requiredRole="faculty">
      <div className="dashboard-container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="dashboard-title mb-4 sm:mb-0">Assignments</h1>
          <Button className="bg-lms-blue hover:bg-lms-blue-dark">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Assignments</p>
                  <p className="text-2xl font-semibold">{instructorAssignments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending Grading</p>
                  <p className="text-2xl font-semibold">
                    {instructorAssignments.reduce((count, assignment) => 
                      count + ((assignment.submissions || []).filter(sub => sub.grade === undefined).length), 0
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Graded</p>
                  <p className="text-2xl font-semibold">
                    {instructorAssignments.reduce((count, assignment) => 
                      count + ((assignment.submissions || []).filter(sub => sub.grade !== undefined).length), 0
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6">
          <Input
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="all">All Assignments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            {upcoming.length > 0 ? (
              upcoming.map(assignment => {
                const course = courses.find(c => c.id === assignment.courseId);
                const submissionCount = assignment.submissions?.length || 0;
                const totalStudents = course?.enrolledStudents?.length || 0;
                
                return (
                  <Card key={assignment.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium">{assignment.title}</h3>
                            <Badge>{course?.code}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 mb-3">{assignment.description}</p>
                          
                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-1" />
                              {assignment.points} points
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              Submissions: {submissionCount}/{totalStudents}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 self-end md:self-start">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button className="bg-lms-blue hover:bg-lms-blue-dark" size="sm">Grade</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-medium mb-2">No upcoming assignments</h3>
                  <p className="text-gray-500">All your assignments have passed their due dates</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            {past.length > 0 ? (
              past.map(assignment => {
                const course = courses.find(c => c.id === assignment.courseId);
                const submissionCount = assignment.submissions?.length || 0;
                const totalStudents = course?.enrolledStudents?.length || 0;
                
                return (
                  <Card key={assignment.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium">{assignment.title}</h3>
                            <Badge>{course?.code}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 mb-3">{assignment.description}</p>
                          
                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-1" />
                              {assignment.points} points
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              Submissions: {submissionCount}/{totalStudents}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 self-end md:self-start">
                          <Button variant="outline" size="sm">View</Button>
                          <Button className="bg-lms-blue hover:bg-lms-blue-dark" size="sm">Grade</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-medium mb-2">No past assignments</h3>
                  <p className="text-gray-500">All your assignments are still upcoming</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            {filteredAssignments.length > 0 ? (
              courses.map(course => {
                const courseAssignments = filteredAssignments.filter(a => a.courseId === course.id);
                
                if (courseAssignments.length === 0) return null;
                
                return (
                  <Card key={course.id}>
                    <CardHeader>
                      <CardTitle>{course.title} ({course.code})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {courseAssignments.map(assignment => {
                          const submissionCount = assignment.submissions?.length || 0;
                          const totalStudents = course.enrolledStudents?.length || 0;
                          const isPast = new Date(assignment.dueDate) <= new Date();
                          
                          return (
                            <div key={assignment.id} className="flex flex-col md:flex-row md:items-start justify-between gap-4 p-4 border rounded-lg">
                              <div>
                                <h3 className="font-medium">{assignment.title}</h3>
                                <p className="text-sm text-gray-600 mt-1 mb-2">{assignment.description}</p>
                                
                                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center">
                                    <FileText className="h-4 w-4 mr-1" />
                                    {assignment.points} points
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    Submissions: {submissionCount}/{totalStudents}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex gap-2 self-end md:self-start">
                                <Button variant="outline" size="sm">View</Button>
                                {!isPast && <Button variant="outline" size="sm">Edit</Button>}
                                <Button className="bg-lms-blue hover:bg-lms-blue-dark" size="sm">Grade</Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              }).filter(Boolean)
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-medium mb-2">No assignments found</h3>
                  <p className="text-gray-500">
                    {searchQuery ? 'No assignments match your search criteria' : 'You haven\'t created any assignments yet'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FacultyAssignments;
