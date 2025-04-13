
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  tags: string[];
}

interface ProblemListProps {
  problems: Problem[];
  studentSubmissions: any[];
  selectedProblem: number | null;
  onSelectProblem: (id: number) => void;
}

const ProblemList: React.FC<ProblemListProps> = ({
  problems,
  studentSubmissions,
  selectedProblem,
  onSelectProblem
}) => {
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Coding Problems</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {problems.map(problem => {
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
                onClick={() => onSelectProblem(problem.id)}
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
  );
};

export default ProblemList;
