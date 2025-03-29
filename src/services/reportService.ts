
import { supabase } from '@/lib/supabase';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Fetch historical data for reports
export const fetchHistoricalData = async (
  batteryBankId: string,
  dataType: string,
  startDate: string,
  endDate: string
) => {
  let tableName: 'battery_strings' | 'battery_banks';
  let columns: string;
  
  // Determine which table and columns to query based on dataType
  switch (dataType) {
    case 'voltage':
      tableName = 'battery_strings';
      columns = 'id, name, voltage, created_at, bank_id';
      break;
    case 'current':
      tableName = 'battery_strings';
      columns = 'id, name, current, created_at, bank_id';
      break;
    case 'temperature':
      tableName = 'battery_banks';
      columns = 'id, name, temperature, created_at';
      break;
    case 'stateOfCharge':
      tableName = 'battery_strings';
      columns = 'id, name, state_of_charge, created_at, bank_id';
      break;
    case 'all':
      // For 'all', we'll use battery_strings table
      tableName = 'battery_strings';
      columns = 'id, name, voltage, current, created_at, bank_id';
      break;
    default:
      throw new Error(`Unsupported data type: ${dataType}`);
  }
  
  let query = supabase
    .from(tableName)
    .select(columns)
    .gte('created_at', startDate)
    .lte('created_at', endDate);
  
  // Filter by battery bank if specified
  if (batteryBankId !== 'all') {
    if (tableName === 'battery_banks') {
      query = query.eq('id', batteryBankId);
    } else {
      query = query.eq('bank_id', batteryBankId);
    }
  }
  
  // Order by creation date
  query = query.order('created_at', { ascending: true });
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
};

// Generate and download Excel report
export const generateExcelReport = async (
  reportType: 'historical' | 'daily' | 'monthly',
  params: any
): Promise<string> => {
  try {
    let data;
    let fileName;
    
    switch (reportType) {
      case 'historical':
        data = await fetchHistoricalData(
          params.batteryBank,
          params.dataType,
          params.startDate,
          params.endDate
        );
        fileName = `Historical_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
        break;
      case 'daily':
        // For daily reports, we fetch data for just that day
        const dayStart = new Date(params.date);
        dayStart.setHours(0, 0, 0, 0);
        
        const dayEnd = new Date(params.date);
        dayEnd.setHours(23, 59, 59, 999);
        
        data = await fetchHistoricalData(
          params.batteryBank,
          'all', // For daily reports, we include all parameters
          dayStart.toISOString(),
          dayEnd.toISOString()
        );
        fileName = `Daily_Report_${new Date(params.date).toISOString().split('T')[0]}.xlsx`;
        break;
      case 'monthly':
        // For monthly reports, we fetch data for that month
        const monthStart = new Date(params.month);
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);
        
        const monthEnd = new Date(params.month);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        monthEnd.setDate(0);
        monthEnd.setHours(23, 59, 59, 999);
        
        data = await fetchHistoricalData(
          params.batteryBank,
          'all', // For monthly reports, we include all parameters
          monthStart.toISOString(),
          monthEnd.toISOString()
        );
        fileName = `Monthly_Report_${new Date(params.month).toISOString().split('T')[0].substring(0, 7)}.xlsx`;
        break;
      default:
        throw new Error(`Unsupported report type: ${reportType}`);
    }
    
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report Data');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Save file
    saveAs(fileBlob, fileName);
    
    return fileName;
  } catch (error) {
    console.error('Error generating report:', error);
    throw new Error('Failed to generate report');
  }
};
