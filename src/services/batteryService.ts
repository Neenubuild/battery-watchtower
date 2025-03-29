
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
  return (data || []) as BatteryBank[];
};

export const fetchBatteryBankById = async (id: string): Promise<BatteryBank> => {
  const { data, error } = await supabase
    .from('battery_banks')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as BatteryBank;
};

// Battery Strings
export const fetchStringsByBankId = async (bankId: string): Promise<BatteryString[]> => {
  const { data, error } = await supabase
    .from('battery_strings')
    .select('*')
    .eq('bank_id', bankId)
    .order('name');
  
  if (error) throw error;
  
  // Add state_of_charge property if it doesn't exist in the database
  const stringsWithStateOfCharge = (data || []).map(str => ({
    ...str,
    state_of_charge: str.state_of_charge !== undefined ? str.state_of_charge : 75 // Default value or calculate based on voltage
  }));
  
  return stringsWithStateOfCharge as BatteryString[];
};

// Battery Cells
export const fetchCellsByStringId = async (stringId: string): Promise<BatteryCell[]> => {
  const { data, error } = await supabase
    .from('battery_cells')
    .select('*')
    .eq('string_id', stringId)
    .order('cell_number');
  
  if (error) throw error;
  return (data || []) as BatteryCell[];
};

// Chargers
export const fetchChargers = async (): Promise<Charger[]> => {
  const { data, error } = await supabase
    .from('chargers')
    .select('*')
    .order('name');
  
  if (error) throw error;
  
  // Add power_factor property if it doesn't exist in the database
  const chargersWithPowerFactor = (data || []).map(charger => ({
    ...charger,
    power_factor: charger.power_factor !== undefined ? charger.power_factor : charger.efficiency / 100 // Compute from efficiency if not present
  }));
  
  return chargersWithPowerFactor as Charger[];
};

export const fetchChargerById = async (id: string): Promise<Charger> => {
  const { data, error } = await supabase
    .from('chargers')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  
  // Add power_factor property if it doesn't exist
  const chargerWithPowerFactor = {
    ...data,
    power_factor: data.power_factor !== undefined ? data.power_factor : data.efficiency / 100 // Compute from efficiency if not present
  };
  
  return chargerWithPowerFactor as Charger;
};

// Alerts
export const fetchRecentAlerts = async (limit = 20): Promise<Alert[]> => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return (data || []) as Alert[];
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
    .eq('key', 'battery_thresholds')
    .single();
  
  if (error) throw error;
  if (!data) {
    throw new Error('System configuration not found');
  }
  
  // Convert the JSON value field to our SystemConfig structure
  const configData = data.value as any;
  
  return {
    id: data.id,
    key: data.key,
    data_refresh_rate: configData.data_refresh_rate || 5000,
    cell_voltage_min: configData.cell_voltage_min || 3.4,
    cell_voltage_max: configData.cell_voltage_max || 4.2,
    cell_temp_max: configData.cell_temp_max || 40,
    string_voltage_min: configData.string_voltage_min || 45,
    string_voltage_max: configData.string_voltage_max || 50,
    string_current_max: configData.string_current_max || 30,
    notification_emails: configData.notification_emails || [],
    notification_sms: configData.notification_sms || [],
    updated_at: data.updated_at,
    value: data.value
  };
};

export const updateSystemConfig = async (config: Partial<SystemConfig>): Promise<SystemConfig> => {
  if (!config.id) {
    throw new Error('System config ID is required for updates');
  }
  
  // Prepare the value object for the database
  const valueObject = {
    cell_voltage_min: config.cell_voltage_min,
    cell_voltage_max: config.cell_voltage_max,
    cell_temp_max: config.cell_temp_max,
    string_voltage_min: config.string_voltage_min,
    string_voltage_max: config.string_voltage_max,
    string_current_max: config.string_current_max,
    data_refresh_rate: config.data_refresh_rate,
    notification_emails: config.notification_emails,
    notification_sms: config.notification_sms
  };
  
  const { data, error } = await supabase
    .from('system_config')
    .update({ 
      value: valueObject,
      updated_at: new Date().toISOString() 
    })
    .eq('id', config.id)
    .eq('key', 'battery_thresholds')
    .select()
    .single();
  
  if (error) throw error;
  if (!data) {
    throw new Error('Failed to update system configuration');
  }
  
  // Convert the response back to our SystemConfig format
  const configData = data.value as any;
  
  return {
    id: data.id,
    key: data.key,
    data_refresh_rate: configData.data_refresh_rate || 5000,
    cell_voltage_min: configData.cell_voltage_min || 3.4,
    cell_voltage_max: configData.cell_voltage_max || 4.2,
    cell_temp_max: configData.cell_temp_max || 40,
    string_voltage_min: configData.string_voltage_min || 45,
    string_voltage_max: configData.string_voltage_max || 50,
    string_current_max: configData.string_current_max || 30,
    notification_emails: configData.notification_emails || [],
    notification_sms: configData.notification_sms || [],
    updated_at: data.updated_at,
    value: data.value
  };
};
