
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchBatteryBanks, 
  fetchStringsByBankId, 
  fetchCellsByStringId,
  fetchChargers
} from '@/services/batteryService';
import { 
  BatteryBank as DBBatteryBank, 
  BatteryString as DBBatteryString, 
  BatteryCell as DBBatteryCell,
  Charger as DBCharger
} from '@/types/database.types';
import { 
  BatteryBank, 
  BatteryString, 
  Cell, 
  Charger,
  SystemData
} from '@/hooks/useBatteryData';

// This hook transforms database data into the format used by our UI
export const useRealBatteryData = (updateInterval = 10000) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Fetch all battery banks
  const banksQuery = useQuery({
    queryKey: ['batteryBanks'],
    queryFn: fetchBatteryBanks,
  });

  // Fetch all chargers
  const chargersQuery = useQuery({
    queryKey: ['chargers'],
    queryFn: fetchChargers,
  });

  // Fetch all strings for each bank
  const stringsQueries = useQuery({
    queryKey: ['batteryStrings'],
    queryFn: async () => {
      if (!banksQuery.data) return [];
      
      const allStrings = [];
      for (const bank of banksQuery.data) {
        const strings = await fetchStringsByBankId(bank.id);
        allStrings.push(...strings);
      }
      return allStrings;
    },
    enabled: !!banksQuery.data,
  });

  // Fetch all cells for each string
  const cellsQueries = useQuery({
    queryKey: ['batteryCells'],
    queryFn: async () => {
      if (!stringsQueries.data) return [];
      
      const allCells = [];
      for (const string of stringsQueries.data) {
        const cells = await fetchCellsByStringId(string.id);
        allCells.push(...cells);
      }
      return allCells;
    },
    enabled: !!stringsQueries.data,
  });

  // Transform the data to match our UI format
  const transformData = (): SystemData | null => {
    if (
      !banksQuery.data || 
      !stringsQueries.data || 
      !cellsQueries.data || 
      !chargersQuery.data
    ) {
      return null;
    }

    try {
      const banks: BatteryBank[] = banksQuery.data.map(dbBank => {
        // Get strings for this bank
        const dbStrings = stringsQueries.data.filter(s => s.bank_id === dbBank.id);
        
        // Transform strings
        const strings: BatteryString[] = dbStrings.map(dbString => {
          // Get cells for this string
          const dbCells = cellsQueries.data.filter(c => c.string_id === dbString.id);
          
          // Transform cells
          const cells: Cell[] = dbCells.map(dbCell => ({
            id: dbCell.id,
            voltage: dbCell.voltage || 0,
            temperature: dbCell.temperature || 0,
            status: mapStatus(dbCell.status)
          }));

          // Calculate alerts based on cell statuses
          const alerts: string[] = [];
          if (cells.some(cell => cell.status === 'warning')) alerts.push('Cell voltage warning');
          if (cells.some(cell => cell.status === 'critical')) alerts.push('Cell voltage critical');
          if (cells.some(cell => cell.status === 'offline')) alerts.push('Cell communication lost');
          if (dbString.current && dbString.current > 25) alerts.push('High discharge current');

          return {
            id: dbString.id,
            name: dbString.name,
            voltage: dbString.voltage || 0,
            current: dbString.current || 0,
            stateOfCharge: dbString.state_of_charge || 0,
            cells,
            status: mapStatus(dbString.status),
            alerts
          };
        });

        return {
          id: dbBank.id,
          name: dbBank.name,
          location: dbBank.location || '',
          installDate: dbBank.install_date || '',
          strings,
          temperature: dbBank.temperature || 0,
          status: mapStatus(dbBank.status)
        };
      });

      // Transform chargers
      const chargers: Charger[] = chargersQuery.data.map(dbCharger => {
        // Calculate alerts based on charger parameters
        const alerts: string[] = [];
        
        if (dbCharger.input_ac_voltage && (dbCharger.input_ac_voltage < 225 || dbCharger.input_ac_voltage > 235)) {
          alerts.push('AC input voltage outside ideal range');
        }
        
        if (dbCharger.output_dc_voltage && dbCharger.output_dc_voltage > 53) {
          alerts.push('High DC output voltage');
        }
        
        if (dbCharger.output_dc_current && dbCharger.output_dc_current > 22) {
          alerts.push('High output current');
        }
        
        if (dbCharger.status === 'critical') {
          alerts.push('Charger fault detected');
        }

        return {
          id: dbCharger.id,
          name: dbCharger.name,
          inputACVoltage: dbCharger.input_ac_voltage || 0,
          outputDCVoltage: dbCharger.output_dc_voltage || 0,
          outputDCCurrent: dbCharger.output_dc_current || 0,
          powerFactor: dbCharger.power_factor || 0,
          efficiency: dbCharger.efficiency || 0,
          status: mapStatus(dbCharger.status),
          alerts
        };
      });

      return {
        batteryBanks: banks,
        chargers,
        lastUpdated: new Date()
      };
    } catch (err) {
      console.error('Error transforming data:', err);
      setError('Error processing battery data');
      return null;
    }
  };

  // Helper function to map DB status to UI status
  const mapStatus = (status: string | null | undefined): 'normal' | 'warning' | 'critical' | 'offline' => {
    if (!status) return 'normal';
    
    switch (status) {
      case 'warning': return 'warning';
      case 'critical': return 'critical';
      case 'offline': return 'offline';
      default: return 'normal';
    }
  };

  const loading = 
    banksQuery.isLoading || 
    stringsQueries.isLoading || 
    cellsQueries.isLoading || 
    chargersQuery.isLoading;

  // Set up data refresh at the specified interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['batteryBanks'] });
      queryClient.invalidateQueries({ queryKey: ['batteryStrings'] });
      queryClient.invalidateQueries({ queryKey: ['batteryCells'] });
      queryClient.invalidateQueries({ queryKey: ['chargers'] });
    }, updateInterval);
    
    return () => clearInterval(intervalId);
  }, [queryClient, updateInterval]);

  return { 
    data: transformData(), 
    loading, 
    error, 
    updateData: () => {
      queryClient.invalidateQueries({ queryKey: ['batteryBanks'] });
      queryClient.invalidateQueries({ queryKey: ['batteryStrings'] });
      queryClient.invalidateQueries({ queryKey: ['batteryCells'] });
      queryClient.invalidateQueries({ queryKey: ['chargers'] });
    }
  };
};
