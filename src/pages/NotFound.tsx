
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const getHomeRoute = () => {
    if (!user) return "/login";
    return `/${user.role}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-lg text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-lms-green-light flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-lms-green" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! The page you're looking for doesn't exist.</p>
        <p className="text-gray-500 mb-8">
          The page at <span className="font-mono bg-gray-100 px-2 py-1 rounded">{location.pathname}</span> could not be found.
        </p>
        <Button asChild className="bg-lms-green hover:bg-lms-green-dark">
          <Link to={getHomeRoute()} className="flex items-center justify-center gap-2">
            <Home size={18} />
            <span>Return to Home</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
