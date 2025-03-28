
import { useState, useEffect } from "react";

// Types for our battery monitoring system
export interface Cell {
  id: string;
  voltage: number;
  temperature: number;
  status: "normal" | "warning" | "critical" | "offline";
}

export interface BatteryString {
  id: string;
  name: string;
  voltage: number;
  current: number;
  stateOfCharge: number;
  cells: Cell[];
  status: "normal" | "warning" | "critical" | "offline";
  alerts: string[];
}

export interface BatteryBank {
  id: string;
  name: string;
  location: string;
  installDate: string;
  strings: BatteryString[];
  temperature: number;
  status: "normal" | "warning" | "critical" | "offline";
}

export interface Charger {
  id: string;
  name: string;
  inputACVoltage: number;
  outputDCVoltage: number;
  outputDCCurrent: number;
  powerFactor: number;
  efficiency: number;
  status: "normal" | "warning" | "critical" | "offline";
  alerts: string[];
}

export interface SystemData {
  batteryBanks: BatteryBank[];
  chargers: Charger[];
  lastUpdated: Date;
}

// Generates random data for our simulation
const generateRandomCell = (bankId: string, stringId: string, cellNumber: number): Cell => {
  const voltage = 1.95 + Math.random() * 0.3; // Random voltage between 1.95 and 2.25V
  const temperature = 20 + Math.random() * 15; // Random temp between 20 and 35°C
  
  let status: "normal" | "warning" | "critical" | "offline" = "normal";
  
  if (voltage < 2.0) status = "warning";
  if (voltage < 1.98) status = "critical";
  if (temperature > 32) status = "warning";
  if (temperature > 34) status = "critical";
  
  // Random offline cell
  if (Math.random() > 0.98) status = "offline";
  
  return {
    id: `${bankId}-${stringId}-${cellNumber}`,
    voltage,
    temperature,
    status
  };
};

const generateRandomString = (bankId: string, stringNumber: number): BatteryString => {
  const cellCount = 24;
  const cells = Array.from({ length: cellCount }, (_, i) => 
    generateRandomCell(bankId, `S${stringNumber}`, i + 1)
  );
  
  const stringVoltage = cells.reduce((sum, cell) => sum + cell.voltage, 0);
  const current = 10 + Math.random() * 20; // Random current between 10 and 30A
  const stateOfCharge = 70 + Math.random() * 30; // Random SoC between 70% and 100%
  
  let alerts: string[] = [];
  const hasWarningCells = cells.some(cell => cell.status === "warning");
  const hasCriticalCells = cells.some(cell => cell.status === "critical");
  const hasOfflineCells = cells.some(cell => cell.status === "offline");
  
  if (hasWarningCells) alerts.push("Cell voltage warning");
  if (hasCriticalCells) alerts.push("Cell voltage critical");
  if (hasOfflineCells) alerts.push("Cell communication lost");
  if (current > 25) alerts.push("High discharge current");
  
  let status: "normal" | "warning" | "critical" | "offline" = "normal";
  if (alerts.length > 0) status = "warning";
  if (hasCriticalCells) status = "critical";
  
  return {
    id: `${bankId}-S${stringNumber}`,
    name: `String ${stringNumber}`,
    voltage: stringVoltage,
    current,
    stateOfCharge,
    cells,
    status,
    alerts
  };
};

const generateRandomBatteryBank = (bankNumber: number): BatteryBank => {
  const stringCount = 2 + Math.floor(Math.random() * 2); // 2-3 strings per bank
  const bankId = `B${bankNumber}`;
  
  const strings = Array.from({ length: stringCount }, (_, i) => 
    generateRandomString(bankId, i + 1)
  );
  
  const temperature = 22 + Math.random() * 8; // Random ambient temp between 22 and 30°C
  
  // Calculate bank status based on string statuses
  let status: "normal" | "warning" | "critical" | "offline" = "normal";
  if (strings.some(s => s.status === "warning")) status = "warning";
  if (strings.some(s => s.status === "critical")) status = "critical";
  
  // Random installation date in the past 1-5 years
  const today = new Date();
  const yearsAgo = 1 + Math.floor(Math.random() * 4);
  const installDate = new Date(today.getFullYear() - yearsAgo, Math.floor(Math.random() * 12), Math.floor(1 + Math.random() * 28));
  
  return {
    id: bankId,
    name: `Battery Bank ${bankNumber}`,
    location: `Substation ${Math.floor(Math.random() * 10) + 1}`,
    installDate: installDate.toISOString().split('T')[0],
    strings,
    temperature,
    status
  };
};

const generateRandomCharger = (chargerNumber: number): Charger => {
  const inputACVoltage = 220 + Math.random() * 20; // 220-240V
  const outputDCVoltage = 48 + Math.random() * 6; // 48-54V
  const outputDCCurrent = 10 + Math.random() * 15; // 10-25A
  const powerFactor = 0.9 + Math.random() * 0.09; // 0.9-0.99
  const efficiency = 85 + Math.random() * 10; // 85-95%
  
  let alerts: string[] = [];
  let status: "normal" | "warning" | "critical" | "offline" = "normal";
  
  if (inputACVoltage < 225 || inputACVoltage > 235) {
    alerts.push("AC input voltage outside ideal range");
    status = "warning";
  }
  
  if (outputDCVoltage > 53) {
    alerts.push("High DC output voltage");
    status = "warning";
  }
  
  if (outputDCCurrent > 22) {
    alerts.push("High output current");
    status = "warning";
  }
  
  // Random fault
  if (Math.random() > 0.95) {
    alerts.push("Charger fault detected");
    status = "critical";
  }
  
  return {
    id: `C${chargerNumber}`,
    name: `Charger ${chargerNumber}`,
    inputACVoltage,
    outputDCVoltage,
    outputDCCurrent,
    powerFactor,
    efficiency,
    status,
    alerts
  };
};

// Generate initial system data
const generateInitialData = (): SystemData => {
  const batteryBankCount = 3;
  const chargerCount = 2;
  
  return {
    batteryBanks: Array.from({ length: batteryBankCount }, (_, i) => 
      generateRandomBatteryBank(i + 1)
    ),
    chargers: Array.from({ length: chargerCount }, (_, i) => 
      generateRandomCharger(i + 1)
    ),
    lastUpdated: new Date()
  };
};

// Custom hook to simulate real-time data
export const useBatteryData = (updateInterval = 10000) => {
  const [data, setData] = useState<SystemData>(generateInitialData());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to update single values slightly
  const updateData = () => {
    setLoading(true);
    
    try {
      setData(prevData => {
        // Create a deep copy of the data to avoid mutation
        const newData: SystemData = JSON.parse(JSON.stringify(prevData));
        newData.lastUpdated = new Date();
        
        // Update battery banks
        newData.batteryBanks.forEach(bank => {
          // Slightly adjust temperature
          bank.temperature = bank.temperature + (Math.random() * 0.4 - 0.2);
          
          // Update strings
          bank.strings.forEach(string => {
            // Slightly adjust voltage and current
            string.voltage = string.voltage + (Math.random() * 0.1 - 0.05);
            string.current = string.current + (Math.random() * 1 - 0.5);
            string.stateOfCharge = Math.min(100, Math.max(0, string.stateOfCharge + (Math.random() * 0.5 - 0.25)));
            
            // Update cells
            string.cells.forEach(cell => {
              cell.voltage = cell.voltage + (Math.random() * 0.01 - 0.005);
              cell.temperature = cell.temperature + (Math.random() * 0.2 - 0.1);
              
              // Update status based on new values
              let newStatus: "normal" | "warning" | "critical" | "offline" = "normal";
              if (cell.voltage < 2.0) newStatus = "warning";
              if (cell.voltage < 1.98) newStatus = "critical";
              if (cell.temperature > 32) newStatus = "warning";
              if (cell.temperature > 34) newStatus = "critical";
              if (cell.status === "offline" && Math.random() > 0.8) newStatus = "normal";
              else if (Math.random() > 0.995) newStatus = "offline";
              
              cell.status = newStatus;
            });
            
            // Recalculate string status
            const hasWarningCells = string.cells.some(cell => cell.status === "warning");
            const hasCriticalCells = string.cells.some(cell => cell.status === "critical");
            const hasOfflineCells = string.cells.some(cell => cell.status === "offline");
            
            string.alerts = [];
            if (hasWarningCells) string.alerts.push("Cell voltage warning");
            if (hasCriticalCells) string.alerts.push("Cell voltage critical");
            if (hasOfflineCells) string.alerts.push("Cell communication lost");
            if (string.current > 25) string.alerts.push("High discharge current");
            
            if (string.alerts.length === 0) string.status = "normal";
            else if (hasCriticalCells) string.status = "critical";
            else string.status = "warning";
          });
          
          // Recalculate bank status
          const hasWarningStrings = bank.strings.some(s => s.status === "warning");
          const hasCriticalStrings = bank.strings.some(s => s.status === "critical");
          
          if (hasCriticalStrings) bank.status = "critical";
          else if (hasWarningStrings) bank.status = "warning";
          else bank.status = "normal";
        });
        
        // Update chargers
        newData.chargers.forEach(charger => {
          // Slightly adjust values
          charger.inputACVoltage = charger.inputACVoltage + (Math.random() * 1 - 0.5);
          charger.outputDCVoltage = charger.outputDCVoltage + (Math.random() * 0.2 - 0.1);
          charger.outputDCCurrent = charger.outputDCCurrent + (Math.random() * 0.5 - 0.25);
          
          // Recalculate status
          charger.alerts = [];
          let newStatus: "normal" | "warning" | "critical" | "offline" = "normal";
          
          if (charger.inputACVoltage < 225 || charger.inputACVoltage > 235) {
            charger.alerts.push("AC input voltage outside ideal range");
            newStatus = "warning";
          }
          
          if (charger.outputDCVoltage > 53) {
            charger.alerts.push("High DC output voltage");
            newStatus = "warning";
          }
          
          if (charger.outputDCCurrent > 22) {
            charger.alerts.push("High output current");
            newStatus = "warning";
          }
          
          // Random critical event
          if (charger.status !== "critical" && Math.random() > 0.98) {
            charger.alerts.push("Charger fault detected");
            newStatus = "critical";
          } else if (charger.status === "critical" && Math.random() > 0.9) {
            newStatus = "normal";
          }
          
          charger.status = newStatus;
        });
        
        return newData;
      });
      
      setError(null);
    } catch (err) {
      setError("Error updating battery data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial update
    updateData();
    
    // Set up interval for updates
    const intervalId = setInterval(updateData, updateInterval);
    
    // Cleanup
    return () => clearInterval(intervalId);
  }, [updateInterval]);

  return { data, loading, error, updateData };
};
