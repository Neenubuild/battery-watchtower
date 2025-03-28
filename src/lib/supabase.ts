
import { createClient } from '@supabase/supabase-js';
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// For backwards compatibility, use the supabase client from integrations
export const supabase = supabaseClient;

// Check if Supabase is properly configured
export const isSupabaseConfigured = true;

// Helper function to check if Supabase is properly connected
export const checkSupabaseConnection = async () => {
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
