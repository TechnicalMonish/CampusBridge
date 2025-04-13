
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CodeEditor from '@/components/ui/CodeEditor';

interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
}

interface ProblemDetailProps {
  problem: Problem | undefined;
  onSubmitCode: (code: string, language: string) => void;
}

const ProblemDetail: React.FC<ProblemDetailProps> = ({ problem, onSubmitCode }) => {
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (!problem) {
    return (
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
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{problem.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{problem.description}</p>
          
          <div className="flex space-x-2">
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
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Solution</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeEditor
            initialCode=""
            onSubmit={onSubmitCode}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProblemDetail;
