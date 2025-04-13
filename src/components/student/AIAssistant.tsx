
import React, { useState } from 'react';
import { Bot, Briefcase, Code, Check, X, Send, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface AIAssistantProps {
  studentSkills?: string[];
  studentName?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  studentSkills = ['React', 'JavaScript', 'TypeScript', 'Node.js'], 
  studentName = 'Student'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [codeInput, setCodeInput] = useState('');
  const [codeAnalysis, setCodeAnalysis] = useState<string | null>(null);
  
  // Mock job listings based on skills
  const mockJobs = [
    {
      title: 'Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'Remote',
      skills: ['React', 'JavaScript', 'TypeScript', 'CSS'],
      description: 'Looking for a skilled frontend developer to join our team.',
      matchPercentage: 90
    },
    {
      title: 'Full Stack Developer',
      company: 'WebSolutions',
      location: 'New York, NY',
      skills: ['React', 'Node.js', 'MongoDB', 'Express'],
      description: 'Seeking a full stack developer with React and Node.js experience.',
      matchPercentage: 85
    },
    {
      title: 'JavaScript Developer',
      company: 'CodeMasters',
      location: 'San Francisco, CA',
      skills: ['JavaScript', 'Vue.js', 'REST API'],
      description: 'Join our team of expert JavaScript developers.',
      matchPercentage: 75
    }
  ];

  // Mock code hints
  const codeHints = {
    react: [
      'Use React.memo for performance optimization in functional components',
      'Don\'t forget to add dependencies in useEffect hooks',
      'Consider using useMemo for expensive calculations'
    ],
    javascript: [
      'Use const for variables that don\'t need to be reassigned',
      'Avoid using var, prefer const or let',
      'Use optional chaining (?.) for safer property access'
    ],
    typescript: [
      'Define interfaces for props and state',
      'Use union types for variables that can have multiple types',
      'Enable strict mode in your tsconfig.json'
    ]
  };
  
  const handleSearch = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (activeTab === 'jobs') {
        // Filter jobs based on query if provided
        let filteredJobs = [...mockJobs];
        if (query.trim()) {
          filteredJobs = mockJobs.filter(job => 
            job.title.toLowerCase().includes(query.toLowerCase()) || 
            job.company.toLowerCase().includes(query.toLowerCase()) ||
            job.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
          );
        }
        setResults(filteredJobs);
      } else if (activeTab === 'hints') {
        const topic = query.toLowerCase();
        let hints = [];
        
        if (topic.includes('react')) {
          hints = codeHints.react;
        } else if (topic.includes('javascript') || topic.includes('js')) {
          hints = codeHints.javascript;
        } else if (topic.includes('typescript') || topic.includes('ts')) {
          hints = codeHints.typescript;
        } else {
          hints = [
            'Try to be more specific about the technology you need help with',
            'For example, try searching for "React", "JavaScript", or "TypeScript"'
          ];
        }
        
        setResults(hints.map(hint => ({ hint })));
      }
      
      setIsLoading(false);
      toast.success('AI Assistant found results for you!');
    }, 1500);
  };
  
  const analyzeCode = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (!codeInput.trim()) {
        toast.error('Please enter some code to analyze');
        setIsLoading(false);
        return;
      }
      
      // Mock code analysis based on simple patterns
      let analysis = '## Code Analysis Results\n\n';
      
      if (codeInput.includes('function') && !codeInput.includes('return')) {
        analysis += '- **Warning**: Function may be missing a return statement\n';
      }
      
      if (codeInput.includes('var ')) {
        analysis += '- **Improvement**: Consider using `const` or `let` instead of `var`\n';
      }
      
      if (codeInput.includes('console.log')) {
        analysis += '- **Note**: Remember to remove console.log statements before production\n';
      }
      
      if (codeInput.includes('useState') && !codeInput.includes('useEffect')) {
        analysis += '- **Suggestion**: You might need useEffect to handle side effects related to this state\n';
      }
      
      if (!codeInput.includes(';')) {
        analysis += '- **Style**: Consider using semicolons at the end of statements for consistency\n';
      }
      
      analysis += '\n### Best Practices:\n- Use meaningful variable names\n- Keep functions small and focused\n- Add comments for complex logic\n- Follow consistent naming conventions';
      
      setCodeAnalysis(analysis);
      setIsLoading(false);
      toast.success('Code analysis complete!');
    }, 2000);
  };
  
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-lms-blue hover:bg-lms-blue-dark">
          <Bot className="h-6 w-6 text-white" />
          <span className="sr-only">Open AI Assistant</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader className="border-b pb-4">
          <DrawerTitle className="flex items-center gap-2 text-lms-green">
            <Sparkles className="h-5 w-5" />
            CampusBridge AI Assistant
          </DrawerTitle>
          <DrawerDescription>
            Your personal AI assistant for job search and coding help
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col h-full overflow-hidden p-4">
          <Tabs defaultValue="jobs" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="jobs" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>Job Finder</span>
              </TabsTrigger>
              <TabsTrigger value="hints" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Code Hints</span>
              </TabsTrigger>
              <TabsTrigger value="review" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span>Code Review</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="jobs" className="h-[calc(85vh-200px)] overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <Textarea 
                  placeholder="Search for jobs matching your skills..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="resize-none"
                />
                <Button 
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="h-full bg-lms-blue hover:bg-lms-blue-dark"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <p className="text-sm text-gray-500 mr-2">Your skills:</p>
                  {studentSkills.map(skill => (
                    <Badge key={skill} variant="secondary" className="bg-lms-blue-light text-lms-blue">
                      {skill}
                    </Badge>
                  ))}
                </div>
                
                {results.length > 0 ? (
                  results.map((job, index) => (
                    <Card key={index} className="border-l-4" style={{ borderLeftColor: `rgb(62, 146, 204, ${job.matchPercentage / 100})` }}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{job.title}</h3>
                            <p className="text-sm text-gray-500">{job.company} • {job.location}</p>
                          </div>
                          {job.matchPercentage && (
                            <Badge className="bg-lms-green-light text-lms-green">
                              {job.matchPercentage}% Match
                            </Badge>
                          )}
                        </div>
                        
                        {job.skills && (
                          <div className="flex flex-wrap gap-2 my-2">
                            {job.skills.map(skill => (
                              <Badge 
                                key={skill} 
                                variant="outline" 
                                className={studentSkills.includes(skill) ? "bg-lms-green-light text-lms-green" : ""}
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {job.description && <p className="text-sm mt-2">{job.description}</p>}
                        
                        <div className="flex justify-end mt-4">
                          <Button size="sm" className="bg-lms-blue hover:bg-lms-blue-dark">
                            Apply Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Search for jobs that match your skills</p>
                    <p className="text-sm text-gray-400 mt-2">Try searching for a job title, company, or skill</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="hints" className="h-[calc(85vh-200px)] overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <Textarea 
                  placeholder="Ask for code hints (e.g., 'React hooks', 'TypeScript tips')..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="resize-none"
                />
                <Button 
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="h-full bg-lms-blue hover:bg-lms-blue-dark"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {results.length > 0 ? (
                  results.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex gap-3">
                          <Sparkles className="h-5 w-5 text-lms-blue flex-shrink-0 mt-0.5" />
                          <p>{item.hint}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Sparkles className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Get coding hints and best practices</p>
                    <p className="text-sm text-gray-400 mt-2">Try asking about React, JavaScript, or TypeScript</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="review" className="h-[calc(85vh-200px)] overflow-y-auto">
              <div className="grid gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Code Review Bot</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Paste your code here for AI review..."
                      className="font-mono min-h-[200px] resize-none"
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                    />
                    <Button
                      className="w-full mt-4 bg-lms-blue hover:bg-lms-blue-dark"
                      onClick={analyzeCode}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Analyzing...' : 'Analyze Code'}
                    </Button>
                  </CardContent>
                </Card>
                
                {codeAnalysis && (
                  <Card className="border-t-4 border-t-lms-blue">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Check className="h-5 w-5 text-lms-blue" />
                        Analysis Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        {codeAnalysis.split('\n').map((line, i) => {
                          if (line.startsWith('##')) {
                            return <h2 key={i} className="text-lg font-semibold mt-2">{line.replace('##', '')}</h2>;
                          } else if (line.startsWith('###')) {
                            return <h3 key={i} className="text-md font-medium mt-2">{line.replace('###', '')}</h3>;
                          } else if (line.startsWith('-')) {
                            // Parse markdown bold
                            const parts = line.split('**');
                            if (parts.length === 3) {
                              return (
                                <div key={i} className="flex items-start gap-2 my-2">
                                  <div className="mt-1 h-2 w-2 rounded-full bg-lms-blue flex-shrink-0"></div>
                                  <div>
                                    <span className="font-semibold">{parts[1]}:</span>
                                    <span>{parts[2]}</span>
                                  </div>
                                </div>
                              );
                            }
                            return <p key={i} className="ml-4">{line}</p>;
                          } else if (line.trim() === '') {
                            return <div key={i} className="h-2"></div>;
                          } else {
                            return <p key={i}>{line}</p>;
                          }
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <DrawerFooter className="border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-lms-green text-white">AI</AvatarFallback>
              </Avatar>
              <span className="text-sm">Powered by CampusBridge AI</span>
            </div>
            <DrawerClose asChild>
              <Button variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AIAssistant;
