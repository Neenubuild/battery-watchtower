
import { createClient } from '@supabase/supabase-js';

// Check for environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a dummy client if credentials are missing
const isConfigured = supabaseUrl && supabaseAnonKey;

// Create and export the Supabase client
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder-url.supabase.co', 'placeholder-key');

// Export configuration status for UI checks
export const isSupabaseConfigured = isConfigured;

// Helper function to check if Supabase is properly configured
export const checkSupabaseConnection = async () => {
  if (!isConfigured) {
    return {
      connected: false,
      message: 'Supabase environment variables are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
    };
  }
  
  try {
    // Attempt a simple query to verify connection
    const { error } = await supabase.from('system_config').select('id').limit(1);
    
    if (error) {
      return {
        connected: false,
        message: `Failed to connect to Supabase: ${error.message}`
      };
    }
    
    return {
      connected: true,
      message: 'Successfully connected to Supabase'
    };
  } catch (err) {
    return {
      connected: false,
      message: `Error checking Supabase connection: ${err instanceof Error ? err.message : String(err)}`
    };
  }
};
