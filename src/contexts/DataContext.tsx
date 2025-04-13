
import React, { createContext, useContext, useState } from 'react';

// Types for our data
export interface Course {
  id: number;
  title: string;
  code: string;
  instructor: string;
  description: string;
  thumbnail: string;
  enrolledStudents?: number[];
}

export interface Assignment {
  id: number;
  courseId: number;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  submissions?: AssignmentSubmission[];
}

export interface AssignmentSubmission {
  id: number;
  assignmentId: number;
  studentId: number;
  submissionDate: string;
  content: string;
  grade?: number;
  feedback?: string;
}

export interface Material {
  id: number;
  courseId: number;
  title: string;
  type: 'pdf' | 'video' | 'document';
  url: string;
  uploadDate: string;
}

export interface Attendance {
  id: number;
  courseId: number;
  studentId: number;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface CodeSubmission {
  id: number;
  studentId: number;
  problemId: number;
  language: 'python' | 'java' | 'c' | 'cpp';
  code: string;
  status: 'correct' | 'incorrect' | 'pending';
  submissionDate: string;
}

export interface CodeProblem {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

// Sample data
const COURSES: Course[] = [
  {
    id: 1,
    title: 'Introduction to Computer Science',
    code: 'CS101',
    instructor: 'Dr. Robert Johnson',
    description: 'An introductory course covering the basics of computer science including algorithms, data structures, and programming fundamentals.',
    thumbnail: '/placeholder.svg',
    enrolledStudents: [1, 2]
  },
  {
    id: 2,
    title: 'Data Structures and Algorithms',
    code: 'CS201',
    instructor: 'Dr. Robert Johnson',
    description: 'A comprehensive study of data structures and algorithms with practical applications in problem-solving.',
    thumbnail: '/placeholder.svg',
    enrolledStudents: [1]
  },
  {
    id: 3,
    title: 'Database Management Systems',
    code: 'CS301',
    instructor: 'Dr. Robert Johnson',
    description: 'Learn the fundamentals of database design, implementation, and management with hands-on SQL practice.',
    thumbnail: '/placeholder.svg',
    enrolledStudents: [2]
  }
];

const ASSIGNMENTS: Assignment[] = [
  {
    id: 1,
    courseId: 1,
    title: 'Basic Programming Concepts',
    description: 'Implement basic algorithms in a programming language of your choice.',
    dueDate: '2025-04-30T23:59:59',
    points: 100,
    submissions: []
  },
  {
    id: 2,
    courseId: 1,
    title: 'Control Structures',
    description: 'Create programs demonstrating various control structures including loops and conditionals.',
    dueDate: '2025-05-15T23:59:59',
    points: 150,
    submissions: []
  },
  {
    id: 3,
    courseId: 2,
    title: 'Implementing Linked Lists',
    description: 'Implement singly and doubly linked lists with essential operations.',
    dueDate: '2025-04-25T23:59:59',
    points: 200,
    submissions: []
  }
];

const MATERIALS: Material[] = [
  {
    id: 1,
    courseId: 1,
    title: 'Introduction to Algorithms',
    type: 'pdf',
    url: '/placeholder.svg',
    uploadDate: '2025-04-01'
  },
  {
    id: 2,
    courseId: 1,
    title: 'Programming Basics Video Lecture',
    type: 'video',
    url: '/placeholder.svg',
    uploadDate: '2025-04-02'
  },
  {
    id: 3,
    courseId: 2,
    title: 'Data Structures Overview',
    type: 'pdf',
    url: '/placeholder.svg',
    uploadDate: '2025-04-03'
  }
];

const ATTENDANCE: Attendance[] = [
  {
    id: 1,
    courseId: 1,
    studentId: 1,
    date: '2025-04-01',
    status: 'present'
  },
  {
    id: 2,
    courseId: 1,
    studentId: 1,
    date: '2025-04-03',
    status: 'present'
  },
  {
    id: 3,
    courseId: 1,
    studentId: 1,
    date: '2025-04-05',
    status: 'absent'
  },
  {
    id: 4,
    courseId: 1,
    studentId: 2,
    date: '2025-04-01',
    status: 'present'
  },
  {
    id: 5,
    courseId: 1,
    studentId: 2,
    date: '2025-04-03',
    status: 'late'
  }
];

const CODE_PROBLEMS: CodeProblem[] = [
  {
    id: 1,
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'easy',
    tags: ['arrays', 'hash table']
  },
  {
    id: 2,
    title: 'Reverse Linked List',
    description: 'Reverse a singly linked list.',
    difficulty: 'medium',
    tags: ['linked list', 'recursion']
  },
  {
    id: 3,
    title: 'Merge K Sorted Lists',
    description: 'Merge k sorted linked lists and return it as one sorted list.',
    difficulty: 'hard',
    tags: ['linked list', 'divide and conquer', 'heap']
  }
];

const CODE_SUBMISSIONS: CodeSubmission[] = [
  {
    id: 1,
    studentId: 1,
    problemId: 1,
    language: 'python',
    code: 'def two_sum(nums, target):\n    map = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in map:\n            return [map[complement], i]\n        map[num] = i\n    return []',
    status: 'correct',
    submissionDate: '2025-04-02'
  },
  {
    id: 2,
    studentId: 1,
    problemId: 2,
    language: 'java',
    code: 'public ListNode reverseList(ListNode head) {\n    ListNode prev = null;\n    ListNode curr = head;\n    while (curr != null) {\n        ListNode nextTemp = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = nextTemp;\n    }\n    return prev;\n}',
    status: 'correct',
    submissionDate: '2025-04-05'
  },
  {
    id: 3,
    studentId: 2,
    problemId: 1,
    language: 'cpp',
    code: 'vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> map;\n    for (int i = 0; i < nums.size(); i++) {\n        int complement = target - nums[i];\n        if (map.find(complement) != map.end()) {\n            return {map[complement], i};\n        }\n        map[nums[i]] = i;\n    }\n    return {};\n}',
    status: 'correct',
    submissionDate: '2025-04-03'
  }
];

// Create the context
interface DataContextType {
  courses: Course[];
  assignments: Assignment[];
  materials: Material[];
  attendance: Attendance[];
  codeProblems: CodeProblem[];
  codeSubmissions: CodeSubmission[];
  getStudentCourses: (studentId: number) => Course[];
  getInstructorCourses: (instructorName: string) => Course[];
  getCourseAssignments: (courseId: number) => Assignment[];
  getCourseMaterials: (courseId: number) => Material[];
  getStudentAttendance: (studentId: number, courseId: number) => Attendance[];
  getStudentCodeSubmissions: (studentId: number) => CodeSubmission[];
  submitAssignment: (submission: Partial<AssignmentSubmission>) => void;
  submitCode: (submission: Partial<CodeSubmission>) => void;
  addMaterial: (material: Partial<Material>) => void;
  addAssignment: (assignment: Partial<Assignment>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [assignments, setAssignments] = useState<Assignment[]>(ASSIGNMENTS);
  const [materials, setMaterials] = useState<Material[]>(MATERIALS);
  const [attendance, setAttendance] = useState<Attendance[]>(ATTENDANCE);
  const [codeProblems, setCodeProblems] = useState<CodeProblem[]>(CODE_PROBLEMS);
  const [codeSubmissions, setCodeSubmissions] = useState<CodeSubmission[]>(CODE_SUBMISSIONS);

  // Helper functions
  const getStudentCourses = (studentId: number): Course[] => {
    return courses.filter(course => course.enrolledStudents?.includes(studentId));
  };

  const getInstructorCourses = (instructorName: string): Course[] => {
    return courses.filter(course => course.instructor === instructorName);
  };

  const getCourseAssignments = (courseId: number): Assignment[] => {
    return assignments.filter(assignment => assignment.courseId === courseId);
  };

  const getCourseMaterials = (courseId: number): Material[] => {
    return materials.filter(material => material.courseId === courseId);
  };

  const getStudentAttendance = (studentId: number, courseId: number): Attendance[] => {
    return attendance.filter(
      record => record.studentId === studentId && record.courseId === courseId
    );
  };

  const getStudentCodeSubmissions = (studentId: number): CodeSubmission[] => {
    return codeSubmissions.filter(submission => submission.studentId === studentId);
  };

  const submitAssignment = (submission: Partial<AssignmentSubmission>) => {
    const newSubmission: AssignmentSubmission = {
      id: Math.max(0, ...assignments.flatMap(a => a.submissions?.map(s => s.id) || [0])) + 1,
      assignmentId: submission.assignmentId!,
      studentId: submission.studentId!,
      submissionDate: new Date().toISOString(),
      content: submission.content!,
      ...submission
    };

    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === newSubmission.assignmentId
          ? {
              ...assignment,
              submissions: [...(assignment.submissions || []), newSubmission]
            }
          : assignment
      )
    );
  };

  const submitCode = (submission: Partial<CodeSubmission>) => {
    const newSubmission: CodeSubmission = {
      id: Math.max(0, ...codeSubmissions.map(s => s.id)) + 1,
      submissionDate: new Date().toISOString(),
      status: 'pending',
      ...submission
    } as CodeSubmission;

    setCodeSubmissions(prev => [...prev, newSubmission]);
  };

  const addMaterial = (material: Partial<Material>) => {
    const newMaterial: Material = {
      id: Math.max(0, ...materials.map(m => m.id)) + 1,
      uploadDate: new Date().toISOString().split('T')[0],
      ...material
    } as Material;

    setMaterials(prev => [...prev, newMaterial]);
  };

  const addAssignment = (assignment: Partial<Assignment>) => {
    const newAssignment: Assignment = {
      id: Math.max(0, ...assignments.map(a => a.id)) + 1,
      submissions: [],
      ...assignment
    } as Assignment;

    setAssignments(prev => [...prev, newAssignment]);
  };

  const value = {
    courses,
    assignments,
    materials,
    attendance,
    codeProblems,
    codeSubmissions,
    getStudentCourses,
    getInstructorCourses,
    getCourseAssignments,
    getCourseMaterials,
    getStudentAttendance,
    getStudentCodeSubmissions,
    submitAssignment,
    submitCode,
    addMaterial,
    addAssignment
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
