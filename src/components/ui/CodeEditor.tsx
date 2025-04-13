
import React, { useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CodeEditorProps {
  initialCode?: string;
  language?: 'python' | 'java' | 'c' | 'cpp';
  onSubmit?: (code: string, language: string) => void;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = '',
  language = 'python',
  onSubmit,
  readOnly = false
}) => {
  const [code, setCode] = useState(initialCode);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [isRunning, setIsRunning] = useState(false);
  
  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value as 'python' | 'java' | 'c' | 'cpp');
  };
  
  const handleSubmit = () => {
    if (!code.trim()) {
      toast.error('Please write some code before submitting');
      return;
    }
    
    setIsRunning(true);
    
    // Simulate code execution
    setTimeout(() => {
      setIsRunning(false);
      toast.success('Code submitted successfully!');
      if (onSubmit) onSubmit(code, selectedLanguage);
    }, 1500);
  };
  
  const handleRun = () => {
    if (!code.trim()) {
      toast.error('Please write some code before running');
      return;
    }
    
    setIsRunning(true);
    
    // Simulate code execution
    setTimeout(() => {
      setIsRunning(false);
      toast.success('Code executed successfully!');
    }, 1500);
  };
  
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="flex items-center justify-between bg-gray-100 px-4 py-2 border-b">
        <Select
          value={selectedLanguage}
          onValueChange={handleLanguageChange}
          disabled={readOnly}
        >
          <SelectTrigger className="w-40 h-8 bg-white">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="c">C</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
          </SelectContent>
        </Select>
        
        {!readOnly && (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8"
              onClick={handleRun}
              disabled={isRunning}
            >
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>
            
            <Button
              size="sm"
              className="h-8 bg-lms-blue hover:bg-lms-blue-dark"
              onClick={handleSubmit}
              disabled={isRunning}
            >
              {isRunning ? 'Submitting...' : 'Submit Code'}
            </Button>
          </div>
        )}
      </div>
      
      <textarea
        className="w-full p-4 font-mono text-sm h-[300px] bg-gray-50 focus:outline-none"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your code here..."
        readOnly={readOnly}
      />
    </div>
  );
};

export default CodeEditor;
