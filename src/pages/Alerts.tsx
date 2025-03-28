
import { useState } from "react";
import { useBatteryData } from "@/hooks/useBatteryData";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/StatusIndicator";
import { Bell, CheckCircle, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Alert types for the system
type AlertType = 
  | "high_string_voltage" 
  | "low_string_voltage" 
  | "high_string_current" 
  | "high_cell_temperature"
  | "low_cell_voltage"
  | "high_cell_voltage"
  | "high_ambient_temperature"
  | "cell_communication_lost"
  | "charger_fault"
  | "ac_input_voltage_out_of_range"
  | "high_dc_output_voltage"
  | "high_output_current";

type AlertSeverity = "warning" | "critical";

interface Alert {
  id: string;
  timestamp: Date;
  type: AlertType;
  source: string;
  message: string;
  severity: AlertSeverity;
  acknowledged: boolean;
}

// Generate sample alerts based on battery data
const generateAlerts = (data: ReturnType<typeof useBatteryData>["data"]): Alert[] => {
  if (!data) return [];
  
  const alerts: Alert[] = [];
  
  // Current time
  const now = new Date();
  
  // Add string-level alerts
  data.batteryBanks.forEach(bank => {
    bank.strings.forEach(string => {
      string.alerts.forEach((alertMessage, index) => {
        // Determine alert type and severity based on message
        let type: AlertType = "high_string_voltage";
        let severity: AlertSeverity = "warning";
        
        if (alertMessage.includes("voltage critical") || alertMessage.includes("temperature critical")) {
          severity = "critical";
        }
        
        if (alertMessage.includes("voltage")) {
          if (alertMessage.includes("high")) {
            type = "high_string_voltage";
          } else {
            type = "low_string_voltage";
          }
        } else if (alertMessage.includes("current")) {
          type = "high_string_current";
        } else if (alertMessage.includes("temperature")) {
          type = "high_cell_temperature";
        } else if (alertMessage.includes("communication lost")) {
          type = "cell_communication_lost";
        }
        
        // Add alert with timestamp 0-60 minutes ago
        const timestamp = new Date(now.getTime() - Math.floor(Math.random() * 60) * 60000);
        
        alerts.push({
          id: `${string.id}-alert-${index}`,
          timestamp,
          type,
          source: `${bank.name} - ${string.name}`,
          message: alertMessage,
          severity,
          acknowledged: Math.random() > 0.7, // 30% chance of being acknowledged
        });
      });
    });
  });
  
  // Add charger alerts
  data.chargers.forEach(charger => {
    charger.alerts.forEach((alertMessage, index) => {
      // Determine alert type and severity based on message
      let type: AlertType = "charger_fault";
      let severity: AlertSeverity = "warning";
      
      if (alertMessage.includes("fault")) {
        severity = "critical";
        type = "charger_fault";
      } else if (alertMessage.includes("AC input")) {
        type = "ac_input_voltage_out_of_range";
      } else if (alertMessage.includes("DC output voltage")) {
        type = "high_dc_output_voltage";
      } else if (alertMessage.includes("output current")) {
        type = "high_output_current";
      }
      
      // Add alert with timestamp 0-60 minutes ago
      const timestamp = new Date(now.getTime() - Math.floor(Math.random() * 60) * 60000);
      
      alerts.push({
        id: `${charger.id}-alert-${index}`,
        timestamp,
        type,
        source: charger.name,
        message: alertMessage,
        severity,
        acknowledged: Math.random() > 0.7, // 30% chance of being acknowledged
      });
    });
  });
  
  // Add some historical alerts (1-24 hours ago)
  for (let i = 0; i < 5; i++) {
    const hours = 1 + Math.floor(Math.random() * 23);
    const timestamp = new Date(now.getTime() - hours * 3600000);
    const bankIndex = Math.floor(Math.random() * data.batteryBanks.length);
    const bank = data.batteryBanks[bankIndex];
    const stringIndex = Math.floor(Math.random() * bank.strings.length);
    const string = bank.strings[stringIndex];
    
    alerts.push({
      id: `historical-alert-${i}`,
      timestamp,
      type: "high_ambient_temperature",
      source: `${bank.name}`,
      message: "High ambient temperature",
      severity: "warning",
      acknowledged: true,
    });
  }
  
  // Sort alerts by timestamp (newest first)
  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Alert type descriptions
const alertTypeDescriptions: Record<AlertType, string> = {
  high_string_voltage: "High String Voltage",
  low_string_voltage: "Low String Voltage",
  high_string_current: "High String Current",
  high_cell_temperature: "High Cell Temperature",
  low_cell_voltage: "Low Cell Voltage",
  high_cell_voltage: "High Cell Voltage",
  high_ambient_temperature: "High Ambient Temperature",
  cell_communication_lost: "Cell Communication Lost",
  charger_fault: "Charger Fault",
  ac_input_voltage_out_of_range: "AC Input Voltage Out of Range",
  high_dc_output_voltage: "High DC Output Voltage",
  high_output_current: "High Output Current",
};

const Alerts = () => {
  const { toast } = useToast();
  const { data } = useBatteryData(10000); // Update every 10 seconds
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterAcknowledged, setFilterAcknowledged] = useState<string>("all");
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());
  
  // Generate alerts from battery data
  const allAlerts = generateAlerts(data);
  
  // Apply filters
  const filteredAlerts = allAlerts.filter(alert => {
    if (filterSeverity !== "all" && alert.severity !== filterSeverity) {
      return false;
    }
    
    if (filterAcknowledged === "acknowledged" && !alert.acknowledged) {
      return false;
    }
    
    if (filterAcknowledged === "unacknowledged" && alert.acknowledged) {
      return false;
    }
    
    return true;
  });
  
  const activeAlerts = allAlerts.filter(alert => !alert.acknowledged);
  const historicalAlerts = allAlerts.filter(alert => alert.acknowledged);
  
  const toggleAlertSelection = (id: string) => {
    const newSelection = new Set(selectedAlerts);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedAlerts(newSelection);
  };
  
  const selectAllVisible = () => {
    const visibleIds = filteredAlerts.map(alert => alert.id);
    setSelectedAlerts(new Set(visibleIds));
  };
  
  const clearSelection = () => {
    setSelectedAlerts(new Set());
  };
  
  const acknowledgeSelected = () => {
    // In a real application, this would send a request to the server
    toast({
      title: "Alerts Acknowledged",
      description: `${selectedAlerts.size} alert(s) have been acknowledged.`,
    });
    clearSelection();
  };
  
  // Format timestamp to a readable format
  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Alerts</h1>
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 mr-1 text-scope-orange" />
          <span className="font-medium">{activeAlerts.length} Active Alerts</span>
        </div>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="historical">Historical Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={selectedAlerts.size === 0}
                onClick={acknowledgeSelected}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Acknowledge Selected
              </Button>
              
              {selectedAlerts.size > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                >
                  Clear Selection ({selectedAlerts.size})
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterAcknowledged} onValueChange={setFilterAcknowledged}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="unacknowledged">Unacknowledged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={selectedAlerts.size > 0 && selectedAlerts.size === filteredAlerts.length}
                      onChange={() => {
                        if (selectedAlerts.size === filteredAlerts.length) {
                          clearSelection();
                        } else {
                          selectAllVisible();
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead className="w-[140px]">Severity</TableHead>
                  <TableHead className="w-[150px]">Source</TableHead>
                  <TableHead>Alert</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No alerts found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAlerts.map((alert) => (
                    <TableRow key={alert.id} className={alert.acknowledged ? "opacity-70" : ""}>
                      <TableCell>
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={selectedAlerts.has(alert.id)}
                          onChange={() => toggleAlertSelection(alert.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {formatTimestamp(alert.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <StatusIndicator 
                            status={alert.severity === "critical" ? "critical" : "warning"} 
                            className="mr-2"
                          />
                          <span className="capitalize">{alert.severity}</span>
                        </div>
                      </TableCell>
                      <TableCell>{alert.source}</TableCell>
                      <TableCell>{alert.message}</TableCell>
                      <TableCell>
                        {alert.acknowledged ? (
                          <span className="text-muted-foreground">Acknowledged</span>
                        ) : (
                          <span className="text-scope-orange font-medium">Active</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="historical" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableCaption>Historical alerts from the past 24 hours</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead className="w-[140px]">Severity</TableHead>
                  <TableHead className="w-[150px]">Source</TableHead>
                  <TableHead>Alert</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicalAlerts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No historical alerts in the past 24 hours
                    </TableCell>
                  </TableRow>
                ) : (
                  historicalAlerts.map((alert) => (
                    <TableRow key={alert.id} className="opacity-70">
                      <TableCell className="font-mono text-xs">
                        {formatTimestamp(alert.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <StatusIndicator 
                            status={alert.severity === "critical" ? "critical" : "warning"} 
                            className="mr-2"
                          />
                          <span className="capitalize">{alert.severity}</span>
                        </div>
                      </TableCell>
                      <TableCell>{alert.source}</TableCell>
                      <TableCell>{alert.message}</TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">Acknowledged</span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Alerts;
