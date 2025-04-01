
import { supabase } from '@/lib/supabase';
import { Alert } from '@/types/database.types';

// Fetch alerts from the database
export const fetchAlerts = async (
  filters: { 
    acknowledged?: boolean, 
    severity?: string,
    source_type?: string,
    limit?: number
  } = {}
): Promise<Alert[]> => {
  let query = supabase
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters.limit) {
    query = query.limit(filters.limit);
  } else {
    query = query.limit(50); // Default limit
  }

  if (filters.severity) {
    query = query.eq('severity', filters.severity);
  }

  if (filters.source_type) {
    query = query.eq('source_type', filters.source_type);
  }

  if (filters.acknowledged !== undefined) {
    query = query.eq('acknowledged', filters.acknowledged);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
};

// Acknowledge a single alert
export const acknowledgeAlert = async (alertId: string): Promise<void> => {
  const { error } = await supabase
    .from('alerts')
    .update({ acknowledged: true })
    .eq('id', alertId);

  if (error) throw error;
};

// Acknowledge multiple alerts
export const acknowledgeAlerts = async (alertIds: string[]): Promise<void> => {
  if (alertIds.length === 0) return;
  
  const { error } = await supabase
    .from('alerts')
    .update({ acknowledged: true })
    .in('id', alertIds);

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
    .select();

  if (error) throw error;
  return data[0];
};

// Subscribe to real-time alerts
export const subscribeToAlerts = (callback: (payload: any) => void) => {
  const subscription = supabase
    .channel('alerts-changes')
    .on('INSERT', (payload) => {
      callback(payload);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
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
