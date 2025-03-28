
import { supabase } from '@/lib/supabase';
import { 
  BatteryBank, 
  BatteryString, 
  BatteryCell, 
  Charger, 
  Alert, 
  SystemConfig 
} from '@/types/database.types';

// Battery Banks
export const fetchBatteryBanks = async (): Promise<BatteryBank[]> => {
  const { data, error } = await supabase
    .from('battery_banks')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
};

export const fetchBatteryBankById = async (id: string): Promise<BatteryBank> => {
  const { data, error } = await supabase
    .from('battery_banks')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

// Battery Strings
export const fetchStringsByBankId = async (bankId: string): Promise<BatteryString[]> => {
  const { data, error } = await supabase
    .from('battery_strings')
    .select('*')
    .eq('bank_id', bankId)
    .order('name');
  
  if (error) throw error;
  return data || [];
};

// Battery Cells
export const fetchCellsByStringId = async (stringId: string): Promise<BatteryCell[]> => {
  const { data, error } = await supabase
    .from('battery_cells')
    .select('*')
    .eq('string_id', stringId)
    .order('cell_number');
  
  if (error) throw error;
  return data || [];
};

// Chargers
export const fetchChargers = async (): Promise<Charger[]> => {
  const { data, error } = await supabase
    .from('chargers')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
};

export const fetchChargerById = async (id: string): Promise<Charger> => {
  const { data, error } = await supabase
    .from('chargers')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

// Alerts
export const fetchRecentAlerts = async (limit = 20): Promise<Alert[]> => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
};

export const acknowledgeAlert = async (alertId: string): Promise<void> => {
  const { error } = await supabase
    .from('alerts')
    .update({ acknowledged: true })
    .eq('id', alertId);
  
  if (error) throw error;
};

// System Configuration
export const fetchSystemConfig = async (): Promise<SystemConfig> => {
  const { data, error } = await supabase
    .from('system_config')
    .select('*')
    .single();
  
  if (error) throw error;
  if (!data) {
    throw new Error('System configuration not found');
  }
  return data as SystemConfig;
};

export const updateSystemConfig = async (config: Partial<SystemConfig>): Promise<SystemConfig> => {
  if (!config.id) {
    throw new Error('System config ID is required for updates');
  }
  
  const { data, error } = await supabase
    .from('system_config')
    .update({ ...config, updated_at: new Date().toISOString() })
    .eq('id', config.id)
    .single();
  
  if (error) throw error;
  if (!data) {
    throw new Error('Failed to update system configuration');
  }
  return data as SystemConfig;
};
