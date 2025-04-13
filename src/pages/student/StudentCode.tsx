
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CodeEditor from '@/components/ui/CodeEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ProfileEditor from '@/components/student/ProfileEditor';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const StudentCode: React.FC = () => {
  const { user } = useAuth();
  const { codeProblems, codeSubmissions, submitCode } = useData();
  const [selectedProblem, setSelectedProblem] = useState<number | null>(null);
  
  if (!user || user.role !== 'student') return null;
  
  const studentId = user.id;
  const studentSubmissions = codeSubmissions.filter(sub => sub.studentId === studentId);
  
  const handleSubmitCode = (code: string, language: string) => {
    if (!selectedProblem) {
      toast.error('Please select a problem first');
      return;
    }
    
    submitCode({
      studentId,
      problemId: selectedProblem,
      language: language as 'python' | 'java' | 'c' | 'cpp',
      code,
      status: 'pending'
    });
    
    // In a real app, we would send the code to a backend for compilation/testing
    setTimeout(() => {
      toast.success('Your solution has been evaluated!');
    }, 2000);
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <DashboardLayout requiredRole="student">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Coding Practice</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Problem List */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center mb-4">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={user.avatar || ''} />
                    <AvatarFallback className="text-lg">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-medium text-lg">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-sm mt-2">{user.bio || 'Computer Science student'}</p>
                </div>
                <Separator className="my-4" />
                <ProfileEditor />
              </CardContent>
            </Card>
          
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Coding Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {codeProblems.map(problem => {
                    const hasSubmitted = studentSubmissions.some(
                      sub => sub.problemId === problem.id
                    );
                    const isCorrect = studentSubmissions.some(
                      sub => sub.problemId === problem.id && sub.status === 'correct'
                    );
                    
                    return (
                      <div 
                        key={problem.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedProblem === problem.id
                            ? 'border-lms-blue bg-lms-blue-light'
                            : 'hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedProblem(problem.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{problem.title}</h3>
                            <div className="flex mt-1 space-x-2">
                              <Badge 
                                className={`${getDifficultyColor(problem.difficulty)} capitalize`}
                              >
                                {problem.difficulty}
                              </Badge>
                              
                              {problem.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="capitalize">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {hasSubmitted && (
                            <div className={`w-3 h-3 rounded-full ${
                              isCorrect ? 'bg-green-500' : 'bg-yellow-500'
                            }`}></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Coding Editor and Problem Description */}
          <div className="lg:col-span-2">
            {selectedProblem ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {codeProblems.find(p => p.id === selectedProblem)?.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      {codeProblems.find(p => p.id === selectedProblem)?.description}
                    </p>
                    
                    <div className="flex space-x-2">
                      <Badge 
                        className={`${
                          getDifficultyColor(
                            codeProblems.find(p => p.id === selectedProblem)?.difficulty || ''
                          )
                        } capitalize`}
                      >
                        {codeProblems.find(p => p.id === selectedProblem)?.difficulty}
                      </Badge>
                      
                      {codeProblems.find(p => p.id === selectedProblem)?.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="capitalize">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Your Solution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CodeEditor
                      initialCode=""
                      onSubmit={handleSubmitCode}
                    />
                    
                    {studentSubmissions.some(sub => sub.problemId === selectedProblem) && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Previous Submissions</h4>
                        <div className="space-y-2">
                          {studentSubmissions
                            .filter(sub => sub.problemId === selectedProblem)
                            .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
                            .map((sub, idx) => (
                              <div key={idx} className="flex justify-between items-center p-3 border rounded-lg">
                                <div>
                                  <p className="text-sm font-medium capitalize">{sub.language}</p>
                                  <p className="text-xs text-gray-500">{new Date(sub.submissionDate).toLocaleString()}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <Badge className={`${
                                    sub.status === 'correct' 
                                      ? 'bg-green-100 text-green-800' 
                                      : sub.status === 'pending'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-red-100 text-red-800'
                                  } capitalize`}>
                                    {sub.status}
                                  </Badge>
                                  <Button variant="outline" size="sm">
                                    View Code
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto mb-4 text-gray-400"
                  >
                    <path d="m18 16 4-4-4-4"></path>
                    <path d="m6 8-4 4 4 4"></path>
                    <path d="m14.5 4-5 16"></path>
                  </svg>
                  <h3 className="text-xl font-medium mb-2">Select a problem</h3>
                  <p className="text-gray-500">
                    Choose a problem from the list to start coding.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentCode;
