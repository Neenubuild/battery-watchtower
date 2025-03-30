
export interface BatteryBank {
  id: string;
  name: string;
  bank_id?: string;  // Make this optional since it might not exist in all contexts
  voltage?: number;  // Make optional
  current?: number;  // Make optional
  status: string;
  created_at: string;
  updated_at: string;
  state_of_charge?: number;
  temperature?: number;
  location?: string;
  install_date?: string;
}

export interface Charger {
  id: string;
  name: string;
  input_ac_voltage: number;
  output_dc_voltage: number;
  output_dc_current: number;
  efficiency: number;
  power_rating: number;
  status: string;
  created_at: string;
  updated_at: string;
  power_factor?: number;
}

export interface BatteryString {
  id: string;
  name: string;
  bank_id: string;
  voltage: number;
  current: number;
  status: string;
  created_at: string;
  updated_at: string;
  state_of_charge?: number;
}

export interface BatteryCell {
  id: string;
  cell_number: number;
  string_id: string;
  voltage: number;
  temperature?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  source_id: string;
  source_type: string;
  severity: string;
  message: string;
  created_at: string;
  updated_at: string;
  acknowledged?: boolean;
}

export interface SystemConfig {
  id: string;
  key: string;
  value: any;
  created_at: string;
  updated_at: string;
  data_refresh_rate?: number;
  cell_voltage_min?: number;
  cell_voltage_max?: number;
  cell_temp_max?: number;
  string_voltage_min?: number;
  string_voltage_max?: number;
  string_current_max?: number;
  notification_emails?: string[];
  notification_sms?: string[];
}
