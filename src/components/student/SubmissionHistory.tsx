
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Submission {
  studentId: string;
  problemId: number;
  language: 'python' | 'java' | 'c' | 'cpp';
  code: string;
  status: 'pending' | 'correct' | 'incorrect';
  submissionDate: string;
}

interface SubmissionHistoryProps {
  submissions: Submission[];
  problemId: number;
}

const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({ submissions, problemId }) => {
  const filteredSubmissions = submissions
    .filter(sub => sub.problemId === problemId)
    .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
  
  if (filteredSubmissions.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-4">
      <h4 className="font-medium mb-2">Previous Submissions</h4>
      <div className="space-y-2">
        {filteredSubmissions.map((sub, idx) => (
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
  );
};

export default SubmissionHistory;
