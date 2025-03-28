
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, BatteryCharging, BatteryMedium, ExternalLink, LogIn, UserPlus } from 'lucide-react';
import { isSupabaseConfigured, checkSupabaseConnection } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SupabaseStatus } from '@/components/SupabaseStatus';

const Index = () => {
  const { user } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState({
    checked: false,
    connected: false,
    message: ''
  });

  useEffect(() => {
    const checkConnection = async () => {
      const status = await checkSupabaseConnection();
      setConnectionStatus({
        checked: true,
        connected: status.connected,
        message: status.message
      });
    };

    checkConnection();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">SCOPE Battery Management System</h1>
          <p className="text-xl text-muted-foreground">
            Remote Battery Management System (BMS) and Battery Charger Monitoring System (BCMS)
          </p>
        </div>
        
        <SupabaseStatus showOnlyOnError={true} className="mb-6" />
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BatteryMedium className="h-5 w-5" />
                Battery Management
              </CardTitle>
              <CardDescription>
                Monitor and manage your battery banks, strings, and cells
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>View real-time battery data, status information, and receive alerts for potential issues.</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                {!user ? (
                  <Link to="/auth">Login to Dashboard</Link>
                ) : (
                  <Link to="/dashboard">Go to Dashboard</Link>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BatteryCharging className="h-5 w-5" />
                Charger Monitoring
              </CardTitle>
              <CardDescription>
                Monitor your battery charging infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Track charger status, power metrics, efficiency, and receive notifications about charging issues.</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                {!user ? (
                  <Link to="/auth">Login to View</Link>
                ) : (
                  <Link to="/real-time">View Chargers</Link>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {!user && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild className="flex items-center gap-2">
              <Link to="/auth">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link to="/auth?tab=signup">
                <UserPlus className="h-4 w-4" />
                <span>Create Account</span>
              </Link>
            </Button>
          </div>
        )}

        {connectionStatus.checked && connectionStatus.connected && !isSupabaseConfigured && (
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <a 
                href="https://docs.lovable.dev/integrations/supabase/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <span>Supabase Integration Docs</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
