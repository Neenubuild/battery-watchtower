
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, BatteryCharging, BatteryMedium, ExternalLink } from 'lucide-react';
import { isSupabaseConfigured, checkSupabaseConnection } from '@/lib/supabase';

const Index = () => {
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
        
        {connectionStatus.checked && !connectionStatus.connected && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Supabase Connection Error</AlertTitle>
            <AlertDescription>
              {connectionStatus.message}
              <div className="mt-2">
                <p>To set up your Supabase environment:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Set the VITE_SUPABASE_URL environment variable to your Supabase project URL</li>
                  <li>Set the VITE_SUPABASE_ANON_KEY environment variable to your Supabase anon/public key</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        )}

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
                <Link to="/dashboard">Go to Dashboard</Link>
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
                <Link to="/real-time-view">View Chargers</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {connectionStatus.checked && !isSupabaseConfigured && (
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
