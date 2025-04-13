
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface CodeEditorProps {
  initialCode?: string;
  onSubmit: (code: string, language: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode = '', onSubmit }) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState('python');
  const [theme, setTheme] = useState('light');
  
  const handleSubmit = () => {
    if (code.trim() === '') {
      toast.error('Please write some code before submitting.');
      return;
    }
    
    onSubmit(code, language);
    toast.success(`${language} code submitted successfully!`);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 justify-between">
        <div className="flex gap-2">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="c">C</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={handleSubmit} className="bg-lms-blue hover:bg-lms-blue-dark">
          Submit Code
        </Button>
      </div>
      
      <div className={`rounded-lg border overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="p-2 border-b flex justify-between items-center">
          <span className={theme === 'dark' ? 'text-white' : 'text-gray-700'}>
            {language.charAt(0).toUpperCase() + language.slice(1)}
          </span>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={`w-full h-80 p-4 font-mono text-sm focus:outline-none resize-none ${
            theme === 'dark' 
              ? 'bg-gray-900 text-gray-50' 
              : 'bg-white text-gray-800'
          }`}
          placeholder={`// Write your ${language} code here...`}
          spellCheck={false}
        ></textarea>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>Press Ctrl+Enter to submit</span>
        <span>{code.split('\n').length} lines | {code.length} characters</span>
      </div>
    </div>
  );
};

export default CodeEditor;
