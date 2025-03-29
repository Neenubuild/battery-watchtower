
export interface BatteryBank {
  id: string;
  name: string;
  bank_id: string;
  voltage: number;
  current: number;
  status: string;
  created_at: string;
  updated_at: string;
  state_of_charge?: number;  // Add optional state of charge
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
  power_factor?: number;  // Add optional power factor
}
