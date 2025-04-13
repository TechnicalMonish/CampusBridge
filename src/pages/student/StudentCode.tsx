
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { toast } from 'sonner';
import StudentProfile from '@/components/student/StudentProfile';
import ProblemList from '@/components/student/ProblemList';
import ProblemDetail from '@/components/student/ProblemDetail';
import SubmissionHistory from '@/components/student/SubmissionHistory';

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
  
  const selectedProblemData = selectedProblem 
    ? codeProblems.find(p => p.id === selectedProblem) 
    : undefined;
  
  return (
    <DashboardLayout requiredRole="student">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Coding Practice</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile and Problem List */}
          <div className="lg:col-span-1">
            <StudentProfile user={user} />
            <ProblemList 
              problems={codeProblems}
              studentSubmissions={studentSubmissions}
              selectedProblem={selectedProblem}
              onSelectProblem={setSelectedProblem}
            />
          </div>
          
          {/* Right Column - Problem Details and Submissions */}
          <div className="lg:col-span-2">
            <ProblemDetail 
              problem={selectedProblemData}
              onSubmitCode={handleSubmitCode}
            />
            
            {selectedProblem && (
              <SubmissionHistory 
                submissions={studentSubmissions}
                problemId={selectedProblem}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentCode;
