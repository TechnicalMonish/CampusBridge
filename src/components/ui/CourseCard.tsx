
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Course } from '@/contexts/DataContext';

interface CourseCardProps {
  course: Course;
  userRole: 'student' | 'faculty' | 'admin';
}

const CourseCard: React.FC<CourseCardProps> = ({ course, userRole }) => {
  const getPath = () => {
    switch (userRole) {
      case 'student':
        return `/student/courses/${course.id}`;
      case 'faculty':
        return `/faculty/courses/${course.id}`;
      case 'admin':
        return `/admin/courses/${course.id}`;
      default:
        return '#';
    }
  };
  
  return (
    <Card className="overflow-hidden card-hover h-full flex flex-col">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardContent className="p-5 flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium bg-lms-blue-light text-lms-blue px-2 py-1 rounded">
            {course.code}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-3">
          {course.description}
        </p>
        
        <p className="text-sm text-gray-700">
          <span className="font-medium">Instructor:</span> {course.instructor}
        </p>
        
        {course.enrolledStudents && (
          <p className="text-sm text-gray-700 mt-1">
            <span className="font-medium">Students:</span> {course.enrolledStudents.length}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="px-5 py-3 border-t bg-gray-50">
        <Link 
          to={getPath()}
          className="text-lms-blue hover:text-lms-blue-dark font-medium text-sm inline-flex items-center"
        >
          View Details
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
