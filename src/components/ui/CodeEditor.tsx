
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
  const [output, setOutput] = useState<string>('');
  
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
    setOutput('');
    
    // Simulate code execution with language-specific output
    setTimeout(() => {
      setIsRunning(false);
      
      let simulatedOutput = '';
      
      // Simulate different outputs based on language and code
      if (selectedLanguage === 'python') {
        if (code.includes('print')) {
          simulatedOutput = 'Hello, World!\n';
          if (code.includes('for') || code.includes('while')) {
            simulatedOutput += 'Loop executed successfully.\n';
          }
        } else if (code.includes('import')) {
          simulatedOutput = 'Modules imported successfully.\n';
        } else {
          simulatedOutput = 'Code executed without output.\n';
        }
      } else if (selectedLanguage === 'java') {
        if (code.includes('System.out.println')) {
          simulatedOutput = 'Hello, World!\n';
        } else if (code.includes('class')) {
          simulatedOutput = 'Compiled successfully.\nHello, World!\n';
        } else {
          simulatedOutput = 'Compilation successful. No output.\n';
        }
      } else if (selectedLanguage === 'cpp' || selectedLanguage === 'c') {
        if (code.includes('cout') || code.includes('printf')) {
          simulatedOutput = 'Hello, World!\n';
        } else if (code.includes('int main')) {
          simulatedOutput = 'Program executed with exit code 0.\n';
        } else {
          simulatedOutput = 'Compilation successful. No output.\n';
        }
      }
      
      // If code contains syntax that might cause errors, simulate an error sometimes
      if ((code.includes('{') && !code.includes('}')) || 
          (code.includes('(') && !code.includes(')'))) {
        simulatedOutput = `Error: Syntax error in line ${Math.floor(Math.random() * 10) + 1}.\n`;
        simulatedOutput += 'Unclosed parenthesis or bracket.\n';
        toast.error('Code execution failed with errors');
      } else {
        toast.success('Code executed successfully');
      }
      
      setOutput(simulatedOutput);
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
        className="w-full p-4 font-mono text-sm h-[200px] bg-gray-50 focus:outline-none"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your code here..."
        readOnly={readOnly}
      />
      
      {/* Output Terminal */}
      <div className="border-t border-gray-200">
        <div className="bg-gray-800 text-white text-xs px-4 py-2">
          Output
        </div>
        <pre className="p-4 font-mono text-sm h-[100px] bg-gray-900 text-green-400 overflow-auto">
          {output || 'Run your code to see output here...'}
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;
