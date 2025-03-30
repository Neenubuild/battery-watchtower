import { BatteryBank, Charger, BatteryString, BatteryCell, SystemConfig } from '@/types/database.types';
import { supabase } from '@/integrations/supabase/client';

// Function to fetch battery banks
export const getBatteryBanks = async (): Promise<BatteryBank[]> => {
  const { data, error } = await supabase
    .from('battery_banks')
    .select('*');

  if (error) throw error;
  return data || [];
};

// Alias for backward compatibility
export const fetchBatteryBanks = getBatteryBanks;

// Function to fetch chargers
export const getChargers = async (): Promise<Charger[]> => {
  const { data, error } = await supabase
    .from('chargers')
    .select('*');

  if (error) throw error;
  return data || [];
};

// Alias for backward compatibility
export const fetchChargers = getChargers;

// Function to fetch battery strings by bank ID
export const fetchStringsByBankId = async (bankId: string): Promise<BatteryString[]> => {
  const { data, error } = await supabase
    .from('battery_strings')
    .select('*')
    .eq('bank_id', bankId);

  if (error) throw error;
  return data || [];
};

// Function to fetch battery cells by string ID
export const fetchCellsByStringId = async (stringId: string): Promise<BatteryCell[]> => {
  const { data, error } = await supabase
    .from('battery_cells')
    .select('*')
    .eq('string_id', stringId);

  if (error) throw error;
  return data || [];
};

// Function to fetch system configuration
export const fetchSystemConfig = async (): Promise<SystemConfig> => {
  const { data, error } = await supabase
    .from('system_config')
    .select('*')
    .eq('key', 'system_settings')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Create default config if it doesn't exist
      const defaultConfig = {
        key: 'system_settings',
        value: {
          data_refresh_rate: 60,
          cell_voltage_min: 1.95,
          cell_voltage_max: 2.25,
          cell_temp_max: 35,
          string_voltage_min: 48,
          string_voltage_max: 54,
          string_current_max: 30,
          notification_emails: [],
          notification_sms: []
        }
      };
      
      const { data: newConfig, error: createError } = await supabase
        .from('system_config')
        .insert(defaultConfig)
        .select()
        .single();
        
      if (createError) throw createError;
      return newConfig as SystemConfig;
    }
    throw error;
  }
  
  return data as SystemConfig;
};

// Function to update system configuration
export const updateSystemConfig = async (config: Partial<SystemConfig>): Promise<SystemConfig> => {
  const { id, ...updateData } = config;
  
  // If we have an ID, update the existing record
  if (id) {
    const { data, error } = await supabase
      .from('system_config')
      .update({
        value: updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data as SystemConfig;
  } 
  // Otherwise, check if we should update by key
  else if (updateData.key) {
    const { data, error } = await supabase
      .from('system_config')
      .update({
        value: updateData,
        updated_at: new Date().toISOString()
      })
      .eq('key', updateData.key)
      .select()
      .single();
      
    if (error) throw error;
    return data as SystemConfig;
  }
  
  throw new Error('Either id or key must be provided to update system config');
};
