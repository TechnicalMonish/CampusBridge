
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { GraduationCap, School, Shield, User } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'faculty' | 'admin'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    setIsLoading(true);
    const success = await login(email, password);
    
    if (success) {
      navigate(`/${role}`);
    }
    setIsLoading(false);
  };

  // Pre-fill email based on selected role
  const fillDemoCredentials = (selectedRole: 'student' | 'faculty' | 'admin') => {
    setRole(selectedRole);
    switch (selectedRole) {
      case 'student':
        setEmail('student1@example.com');
        break;
      case 'faculty':
        setEmail('faculty@example.com');
        break;
      case 'admin':
        setEmail('admin@example.com');
        break;
    }
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-md mb-6">
          <h1 className="text-3xl font-bold mb-2 text-center text-lms-blue">EduSphere</h1>
          <p className="text-center text-gray-500">Your complete learning management solution</p>
        </div>
        
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Log in to your account</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <div className="text-sm font-medium mb-2">Log in as:</div>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={role === 'student' ? 'default' : 'outline'}
                    className="flex flex-col items-center py-3 h-auto"
                    onClick={() => fillDemoCredentials('student')}
                  >
                    <User className="h-5 w-5 mb-1" />
                    <span>Student</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant={role === 'faculty' ? 'default' : 'outline'}
                    className="flex flex-col items-center py-3 h-auto"
                    onClick={() => fillDemoCredentials('faculty')}
                  >
                    <GraduationCap className="h-5 w-5 mb-1" />
                    <span>Faculty</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant={role === 'admin' ? 'default' : 'outline'}
                    className="flex flex-col items-center py-3 h-auto"
                    onClick={() => fillDemoCredentials('admin')}
                  >
                    <Shield className="h-5 w-5 mb-1" />
                    <span>Admin</span>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-xs text-lms-blue hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-lms-blue hover:bg-lms-blue-dark"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Log in'}
                </Button>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t p-6">
            <p className="text-sm text-center text-gray-500">
              Don't have an account? Contact your administrator.
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right side - Illustration */}
      <div className="hidden md:flex md:w-1/2 bg-lms-blue text-white">
        <div className="max-w-md mx-auto p-12 flex flex-col justify-center">
          <School className="h-16 w-16 mb-6" />
          <h2 className="text-3xl font-bold mb-4">Welcome to EduSphere LMS</h2>
          <p className="text-lg mb-6">
            The complete learning management solution for modern education.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded mr-3">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">For Students</h3>
                <p className="text-sm opacity-80">Access courses, submit assignments, and track your progress</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded mr-3">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">For Faculty</h3>
                <p className="text-sm opacity-80">Manage courses, analyze student performance, and deliver content</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded mr-3">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">For Administrators</h3>
                <p className="text-sm opacity-80">Oversee institution-wide metrics and manage users</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
