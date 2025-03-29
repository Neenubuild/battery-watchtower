
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
      console.error("Supabase connection error:", error.message);
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
    console.error("Error checking Supabase connection:", err);
    return {
      connected: false,
      message: `Error checking Supabase connection: ${err instanceof Error ? err.message : String(err)}`
    };
  }
};

// Helper function to execute a SQL alteration to add missing columns
export const updateBatteryStringsSchema = async () => {
  try {
    // Check if state_of_charge column exists
    const { data, error } = await supabase.rpc('alter_battery_strings_table_if_needed', {});
    
    if (error) {
      console.error("Error updating battery_strings schema:", error.message);
      return {
        success: false,
        message: `Failed to update schema: ${error.message}`
      };
    }
    
    return {
      success: true,
      message: 'Battery strings schema updated successfully or already up-to-date'
    };
  } catch (err) {
    console.error("Error in schema update:", err);
    return {
      success: false,
      message: `Error in schema update: ${err instanceof Error ? err.message : String(err)}`
    };
  }
};
