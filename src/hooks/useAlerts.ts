
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { fetchAlerts, acknowledgeAlerts, subscribeToAlerts } from '@/services/alertService';
import { Alert } from '@/types/database.types';

export const useAlerts = (
  filters: { 
    acknowledged?: boolean, 
    severity?: 'warning' | 'critical',
    source_type?: 'cell' | 'string' | 'bank' | 'charger',
    limit?: number
  } = {},
  autoRefresh = false
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Fetch alerts with filters
  const alertsQuery = useQuery({
    queryKey: ['alerts', filters],
    queryFn: () => fetchAlerts(filters),
  });

  // Acknowledge one or more alerts
  const handleAcknowledge = async (alertIds: string[]) => {
    try {
      await acknowledgeAlerts(alertIds);
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast({
        title: "Alerts acknowledged",
        description: `${alertIds.length} alert(s) marked as acknowledged`,
      });
    } catch (err) {
      console.error('Error acknowledging alerts:', err);
      setError('Failed to acknowledge alerts');
      toast({
        title: "Error",
        description: "Failed to acknowledge alerts",
        variant: "destructive",
      });
    }
  };

  // Subscribe to real-time alert updates
  useEffect(() => {
    if (!autoRefresh) return;
    
    const unsubscribe = subscribeToAlerts((payload) => {
      // Add the new alert to the query cache
      queryClient.setQueryData(['alerts', filters], (oldData: Alert[] | undefined) => {
        if (!oldData) return [payload.new];
        return [payload.new, ...oldData];
      });
      
      // Show a toast notification for new alerts
      toast({
        title: payload.new.severity === 'critical' ? "Critical Alert" : "Warning Alert",
        description: payload.new.message,
        variant: payload.new.severity === 'critical' ? "destructive" : "default",
      });
    });
    
    return () => {
      unsubscribe();
    };
  }, [autoRefresh, filters, queryClient, toast]);

  return {
    alerts: alertsQuery.data || [],
    loading: alertsQuery.isLoading,
    error,
    acknowledgeAlerts: handleAcknowledge,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['alerts', filters] })
  };
};
