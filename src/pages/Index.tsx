
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">SCOPE Battery Management System</h1>
        <p className="text-xl text-gray-600 mb-8">
          Remote Battery Management System (BMS) and Battery Charger Monitoring System (BCMS)
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 place-items-center">
          <Card className="hover:shadow-lg transition-shadow duration-300 w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-blue-800">
                <Database className="h-6 w-6" />
                Battery Management
              </CardTitle>
              <CardDescription className="text-center">
                Monitor and manage your battery banks, strings, and cells
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                View real-time battery data, status information, and receive alerts for potential issues.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                asChild 
                variant="outline" 
                className="w-full border-blue-500 text-blue-700 hover:bg-blue-50"
              >
                {!user ? (
                  <Link to="/auth">Login to Dashboard</Link>
                ) : (
                  <Link to="/dashboard">Go to Dashboard</Link>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow duration-300 w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-green-800">
                <Zap className="h-6 w-6" />
                Charger Monitoring
              </CardTitle>
              <CardDescription className="text-center">
                Monitor your battery charging infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Track charger status, power metrics, efficiency, and receive notifications about charging issues.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                asChild 
                variant="outline" 
                className="w-full border-green-500 text-green-700 hover:bg-green-50"
              >
                {!user ? (
                  <Link to="/auth">Login to View</Link>
                ) : (
                  <Link to="/real-time">View Chargers</Link>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
