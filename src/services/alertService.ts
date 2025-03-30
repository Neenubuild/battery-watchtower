
import { supabase } from '@/lib/supabase';
import { Alert } from '@/types/database.types';

// Fetch alerts from the database
export const fetchAlerts = async (
  limit = 50,
  severity?: string,
  acknowledged?: boolean
): Promise<Alert[]> => {
  let query = supabase
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (severity) {
    query = query.eq('severity', severity);
  }

  if (acknowledged !== undefined) {
    query = query.eq('acknowledged', acknowledged);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
};

// Acknowledge an alert
export const acknowledgeAlert = async (alertId: string): Promise<void> => {
  const { error } = await supabase
    .from('alerts')
    .update({ acknowledged: true })
    .eq('id', alertId);

  if (error) throw error;
};

// Delete an alert
export const deleteAlert = async (alertId: string): Promise<void> => {
  const { error } = await supabase
    .from('alerts')
    .delete()
    .eq('id', alertId);

  if (error) throw error;
};

// Create a new alert
export const createAlert = async (alert: Omit<Alert, 'id' | 'created_at' | 'updated_at'>): Promise<Alert> => {
  const { data, error } = await supabase
    .from('alerts')
    .insert({
      source_id: alert.source_id,
      source_type: alert.source_type,
      severity: alert.severity,
      message: alert.message,
      acknowledged: alert.acknowledged || false
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Create multiple test alerts for development purposes
export const createTestAlerts = async (count: number): Promise<void> => {
  const testAlerts = Array.from({ length: count }, (_, i) => ({
    source_id: `test-source-${i}`,
    source_type: i % 2 === 0 ? 'battery_bank' : 'charger',
    severity: i % 3 === 0 ? 'critical' : i % 3 === 1 ? 'warning' : 'info',
    message: `Test alert message ${i}`,
    acknowledged: i % 4 === 0
  }));

  const { error } = await supabase
    .from('alerts')
    .insert(testAlerts);

  if (error) throw error;
};
