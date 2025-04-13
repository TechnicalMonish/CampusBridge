
import React, { useState } from 'react';
import { BookText, FileText, File, Video, FileImage, Upload, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const FacultyMaterials: React.FC = () => {
  const { user } = useAuth();
  const { getInstructorCourses, materials } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!user || user.role !== 'faculty') return null;
  
  const instructorName = user.name;
  const courses = getInstructorCourses(instructorName);
  
  // Filter materials for the instructor's courses
  const instructorMaterials = materials.filter(material => 
    courses.some(course => course.id === material.courseId)
  );
  
  // Filter materials based on search query
  const filteredMaterials = instructorMaterials.filter(material => 
    material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    courses.find(course => course.id === material.courseId)?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get material icon based on type
  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'doc':
        return <File className="h-5 w-5 text-blue-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-purple-500" />;
      case 'image':
        return <FileImage className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Group materials by course
  const materialsByCourse: Record<number, typeof instructorMaterials> = {};
  courses.forEach(course => {
    materialsByCourse[course.id] = filteredMaterials.filter(
      material => material.courseId === course.id
    );
  });
  
  return (
    <DashboardLayout requiredRole="faculty">
      <div className="dashboard-container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="dashboard-title mb-4 sm:mb-0">Course Materials</h1>
          <Button className="bg-lms-blue hover:bg-lms-blue-dark">
            <Upload className="h-4 w-4 mr-2" />
            Upload New Material
          </Button>
        </div>
        
        <div className="mb-6">
          <Input
            placeholder="Search materials..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Materials</TabsTrigger>
            <TabsTrigger value="recent">Recent Uploads</TabsTrigger>
            <TabsTrigger value="popular">Most Accessed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {Object.entries(materialsByCourse).map(([courseId, courseMaterials]) => {
              const course = courses.find(c => c.id === parseInt(courseId));
              
              if (!course || courseMaterials.length === 0) return null;
              
              return (
                <Card key={courseId}>
                  <CardHeader>
                    <CardTitle>{course.title} ({course.code})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {courseMaterials.map(material => (
                        <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            {getMaterialIcon(material.type)}
                            <div>
                              <h3 className="font-medium">{material.title}</h3>
                              <p className="text-sm text-gray-500">
                                Added: {new Date(material.uploadDate).toLocaleDateString()} • 
                                {material.size ? ` ${material.size} • ` : ' '}
                                <Badge variant="outline" className="ml-1 capitalize">
                                  {material.type}
                                </Badge>
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {Object.values(materialsByCourse).every(materials => materials.length === 0) && (
              <Card>
                <CardContent className="py-10 text-center">
                  <BookText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-medium mb-2">No materials found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery ? 'No materials match your search criteria' : 'You have not uploaded any course materials yet'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="recent">
            <Card>
              <CardContent className="py-6">
                <div className="space-y-2">
                  {filteredMaterials
                    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
                    .slice(0, 5)
                    .map(material => {
                      const course = courses.find(c => c.id === material.courseId);
                      return (
                        <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            {getMaterialIcon(material.type)}
                            <div>
                              <h3 className="font-medium">{material.title}</h3>
                              <p className="text-sm text-gray-500">
                                {course?.title} • Added: {new Date(material.uploadDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </div>
                      );
                    })}
                    
                  {filteredMaterials.length === 0 && (
                    <div className="py-8 text-center">
                      <p className="text-gray-500">No recent materials</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="popular">
            <Card>
              <CardContent className="py-6">
                <div className="space-y-2">
                  {filteredMaterials
                    .slice(0, 5)
                    .map(material => {
                      const course = courses.find(c => c.id === material.courseId);
                      return (
                        <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            {getMaterialIcon(material.type)}
                            <div>
                              <h3 className="font-medium">{material.title}</h3>
                              <p className="text-sm text-gray-500">
                                {course?.title} • {Math.floor(Math.random() * 100)} views
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </div>
                      );
                    })}
                    
                  {filteredMaterials.length === 0 && (
                    <div className="py-8 text-center">
                      <p className="text-gray-500">No popular materials</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FacultyMaterials;
