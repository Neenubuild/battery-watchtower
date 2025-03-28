
import { supabase } from '@/lib/supabase';
import { Alert } from '@/types/database.types';

export const fetchAlerts = async (
  filters: { 
    acknowledged?: boolean, 
    severity?: 'warning' | 'critical',
    source_type?: 'cell' | 'string' | 'bank' | 'charger',
    limit?: number
  } = {}
): Promise<Alert[]> => {
  let query = supabase
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (filters.acknowledged !== undefined) {
    query = query.eq('acknowledged', filters.acknowledged);
  }
  
  if (filters.severity) {
    query = query.eq('severity', filters.severity);
  }
  
  if (filters.source_type) {
    query = query.eq('source_type', filters.source_type);
  }
  
  if (filters.limit) {
    query = query.limit(filters.limit);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
};

export const acknowledgeAlerts = async (alertIds: string[]): Promise<void> => {
  const { error } = await supabase
    .from('alerts')
    .update({ acknowledged: true })
    .in('id', alertIds);
  
  if (error) throw error;
};

export const createAlert = async (alert: Omit<Alert, 'id' | 'created_at'>): Promise<Alert> => {
  const { data, error } = await supabase
    .from('alerts')
    .insert([{ ...alert, created_at: new Date().toISOString() }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Subscribe to new alerts using Supabase realtime
export const subscribeToAlerts = (callback: (payload: { new: Alert }) => void): (() => void) => {
  const subscription = supabase
    .channel('alerts-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'alerts' },
      callback
    )
    .subscribe();
  
  // Return unsubscribe function
  return () => {
    supabase.removeChannel(subscription);
  };
};
