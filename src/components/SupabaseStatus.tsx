
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { checkSupabaseConnection } from '@/lib/supabase';

interface SupabaseStatusProps {
  className?: string;
  showOnlyOnError?: boolean;
}

export const SupabaseStatus = ({ 
  className = '',
  showOnlyOnError = false 
}: SupabaseStatusProps) => {
  const [status, setStatus] = useState({
    checked: false,
    connected: false,
    message: ''
  });

  useEffect(() => {
    const checkConnection = async () => {
      const connectionStatus = await checkSupabaseConnection();
      setStatus({
        checked: true,
        connected: connectionStatus.connected,
        message: connectionStatus.message
      });
    };

    checkConnection();
  }, []);

  if (!status.checked || (showOnlyOnError && status.connected)) {
    return null;
  }

  return (
    <Alert 
      variant={status.connected ? "default" : "destructive"} 
      className={className}
    >
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        {status.connected ? 'Connected to Supabase' : 'Supabase Connection Error'}
      </AlertTitle>
      <AlertDescription>
        {status.message}
        {!status.connected && (
          <div className="mt-2">
            <p>To set up your Supabase environment:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Set the VITE_SUPABASE_URL environment variable to your Supabase project URL</li>
              <li>Set the VITE_SUPABASE_ANON_KEY environment variable to your Supabase anon/public key</li>
            </ol>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};
