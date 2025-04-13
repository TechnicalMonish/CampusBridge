
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Clock, 
  MapPin, 
  FileText, 
  Calendar,
  Users,
  BookText,
  ChevronLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { Course } from '@/contexts/DataContext';

const StudentCourses = () => {
  const { user } = useAuth();
  const { getStudentCourses, getCourseAssignments, getCourseMaterials } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const courseId = searchParams.get('id');
  
  // Convert courseId to number if it exists
  const selectedCourseId = courseId ? parseInt(courseId) : null;
  
  // Get student courses
  const courses = user?.id ? getStudentCourses(+user.id) : [];
  
  // Selected course
  const selectedCourse = selectedCourseId 
    ? courses.find(course => course.id === selectedCourseId) 
    : null;
  
  // Course assignments and materials
  const assignments = selectedCourse 
    ? getCourseAssignments(selectedCourse.id) 
    : [];
  
  const materials = selectedCourse 
    ? getCourseMaterials(selectedCourse.id) 
    : [];
  
  // Handle back to course list
  const backToCourseList = () => {
    setSearchParams({});
  };
  
  if (!user) return null;
  
  return (
    <DashboardLayout requiredRole="student">
      <div className="dashboard-container">
        {selectedCourse ? (
          // Course Detail View
          <>
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                className="mr-4"
                onClick={backToCourseList}
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Back to Courses
              </Button>
              <h1 className="dashboard-title mb-0">{selectedCourse.title}</h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="mb-2">{selectedCourse.code}</Badge>
                        <CardTitle className="text-2xl">{selectedCourse.title}</CardTitle>
                        <CardDescription>Instructor: {selectedCourse.instructor}</CardDescription>
                      </div>
                      <Button onClick={() => toast.success('Syllabus downloaded')}>Download Syllabus</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="font-medium mb-2">Course Description</h3>
                      <p className="text-gray-700">{selectedCourse.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-start">
                        <div className="mt-1 mr-3 p-2 bg-lms-blue-light rounded-md text-lms-blue">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Schedule</p>
                          <p className="font-medium">{selectedCourse.schedule || 'TBA'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mt-1 mr-3 p-2 bg-lms-blue-light rounded-md text-lms-blue">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{selectedCourse.location || 'TBA'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mt-1 mr-3 p-2 bg-lms-blue-light rounded-md text-lms-blue">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Credits</p>
                          <p className="font-medium">{selectedCourse.credits}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Tabs defaultValue="assignments" className="mb-6">
                  <TabsList className="mb-4">
                    <TabsTrigger value="assignments">Assignments</TabsTrigger>
                    <TabsTrigger value="materials">Course Materials</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="assignments">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <FileText className="h-5 w-5 mr-2" />
                          Assignments
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {assignments.length > 0 ? (
                          <div className="space-y-4">
                            {assignments.map(assignment => (
                              <div key={assignment.id} className="p-4 border rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{assignment.title}</h4>
                                    <p className="text-sm text-gray-700 my-2">{assignment.description}</p>
                                  </div>
                                  <div className="text-right">
                                    <Badge variant="outline">{assignment.points} pts</Badge>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center mt-3">
                                  <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                  </div>
                                  <Button 
                                    size="sm"
                                    onClick={() => toast.success('Assignment view opened')}
                                  >
                                    View Assignment
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center py-8 text-gray-500">
                            No assignments posted yet.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="materials">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <BookText className="h-5 w-5 mr-2" />
                          Course Materials
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {materials.length > 0 ? (
                          <div className="space-y-4">
                            {materials.map(material => (
                              <div key={material.id} className="flex items-center p-4 border rounded-lg">
                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mr-4">
                                  <img src={material.url} alt={material.title} className="w-full h-full object-cover rounded" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{material.title}</h4>
                                  <p className="text-xs text-gray-500">
                                    {material.type.toUpperCase()} • {material.size} • Uploaded on {material.uploadDate}
                                  </p>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => toast.success(`${material.title} opened`)}
                                >
                                  View
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center py-8 text-gray-500">
                            No materials posted yet.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Class Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between border-b pb-3 mb-3">
                      <span className="text-gray-500">Capacity</span>
                      <span className="font-medium">25 students</span>
                    </div>
                    <div className="flex justify-between border-b pb-3 mb-3">
                      <span className="text-gray-500">Enrolled</span>
                      <span className="font-medium">{selectedCourse.enrolledStudents?.length || 0} students</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status</span>
                      <Badge variant={selectedCourse.active ? "default" : "outline"}>
                        {selectedCourse.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-base">
                      <Calendar className="h-5 w-5 mr-2" />
                      Upcoming Deadlines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {assignments.length > 0 ? (
                      <div className="space-y-3">
                        {assignments
                          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                          .slice(0, 3)
                          .map(assignment => (
                            <div key={assignment.id} className="flex justify-between items-center p-3 border rounded-lg">
                              <div>
                                <p className="font-medium text-sm">{assignment.title}</p>
                                <p className="text-xs text-gray-500">
                                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge variant="outline">
                                {assignment.points} pts
                              </Badge>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-center py-4 text-sm text-gray-500">
                        No upcoming deadlines
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          // Courses List View
          <>
            <h1 className="dashboard-title">My Courses</h1>
            
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge>{course.code}</Badge>
                        <Badge variant={course.active ? "default" : "outline"}>
                          {course.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <CardTitle className="mt-2">{course.title}</CardTitle>
                      <CardDescription>{course.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {course.description}
                      </p>
                      <div className="flex justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {course.credits} credits
                        </div>
                        <Button 
                          onClick={() => setSearchParams({ id: course.id.toString() })}
                        >
                          View Course
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Courses Enrolled</h3>
                  <p className="text-gray-500 mb-4">
                    You are not enrolled in any courses yet.
                  </p>
                  <Button>Browse Available Courses</Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentCourses;
