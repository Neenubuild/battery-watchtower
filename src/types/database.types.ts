
export interface BatteryCell {
  id: string;
  string_id: string;
  cell_number: number;
  voltage: number;
  temperature: number;
  status: 'normal' | 'warning' | 'critical' | 'offline';
  created_at: string;
  updated_at: string;
}

export interface BatteryString {
  id: string;
  bank_id: string;
  name: string;
  voltage: number;
  current: number;
  state_of_charge: number;
  status: 'normal' | 'warning' | 'critical' | 'offline';
  created_at: string;
  updated_at: string;
}

export interface BatteryBank {
  id: string;
  name: string;
  location: string;
  install_date: string;
  temperature: number;
  status: 'normal' | 'warning' | 'critical' | 'offline';
  created_at: string;
  updated_at: string;
}

export interface Charger {
  id: string;
  name: string;
  input_ac_voltage: number;
  output_dc_voltage: number;
  output_dc_current: number;
  power_factor: number;
  efficiency: number;
  status: 'normal' | 'warning' | 'critical' | 'offline';
  created_at: string;
  updated_at: string;
  power_rating?: number; // Added to match database schema
}

export interface Alert {
  id: string;
  source_type: 'cell' | 'string' | 'bank' | 'charger';
  source_id: string;
  message: string;
  severity: 'warning' | 'critical';
  acknowledged: boolean;
  created_at: string;
  updated_at: string;
}

export interface SystemConfig {
  id: string;
  key?: string; // Added to match database schema
  data_refresh_rate: number;
  cell_voltage_min: number;
  cell_voltage_max: number;
  cell_temp_max: number;
  string_voltage_min: number;
  string_voltage_max: number;
  string_current_max: number;
  notification_emails: string[];
  notification_sms: string[];
  updated_at: string;
  value?: any; // Added to match database schema
}
