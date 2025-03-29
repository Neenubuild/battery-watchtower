import { BatteryBank, Charger } from '@/types/database.types';
import { supabase } from '@/integrations/supabase/client';

export const getBatteryBanks = async (): Promise<BatteryBank[]> => {
  const { data, error } = await supabase
    .from('battery_banks')
    .select('*');

  if (error) throw error;
  return data || [];
};

export const getChargers = async (): Promise<Charger[]> => {
  const { data, error } = await supabase
    .from('chargers')
    .select('*');

  if (error) throw error;
  return data || [];
};
