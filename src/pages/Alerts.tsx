
import { useState } from "react";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableBody, 
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
import { AlertTriangle, CheckCircle, Clock, Bell, BellOff } from "lucide-react";
import { useAlerts } from "@/hooks/useAlerts";
import { format } from "date-fns";

const Alerts = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  
  // Get active alerts
  const { 
    alerts: activeAlerts, 
    loading: activeLoading, 
    error: activeError,
    acknowledgeAlerts,
    refresh: refreshActive
  } = useAlerts({ acknowledged: false }, true);
  
  // Get acknowledged alerts
  const { 
    alerts: acknowledgedAlerts, 
    loading: acknowledgedLoading, 
    error: acknowledgedError
  } = useAlerts({ acknowledged: true });
  
  // Filter alerts based on selected criteria
  const filteredAlerts = (activeTab === "active" ? activeAlerts : acknowledgedAlerts)
    .filter(alert => filterSeverity === "all" || alert.severity === filterSeverity)
    .filter(alert => filterSource === "all" || alert.source_type === filterSource);
  
  // Handle selecting all alerts
  const handleSelectAll = () => {
    if (selectedAlerts.length === filteredAlerts.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(filteredAlerts.map(alert => alert.id));
    }
  };
  
  // Handle acknowledging selected alerts
  const handleAcknowledge = async () => {
    if (selectedAlerts.length > 0) {
      await acknowledgeAlerts(selectedAlerts);
      setSelectedAlerts([]);
      refreshActive();
    }
  };
  
  // Format alert source for display
  const formatSource = (type: string, id: string) => {
    switch (type) {
      case 'cell':
        return `Cell ${id}`;
      case 'string':
        return `String ${id}`;
      case 'bank':
        return `Battery Bank ${id}`;
      case 'charger':
        return `Charger ${id}`;
      default:
        return id;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Alerts & Notifications</h1>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {activeAlerts.length} active alerts
          </span>
          {activeAlerts.length > 0 && (
            <AlertTriangle className="h-5 w-5 text-scope-warning" />
          )}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="active">
            <Bell className="h-4 w-4 mr-2" />
            Active Alerts
          </TabsTrigger>
          <TabsTrigger value="acknowledged">
            <BellOff className="h-4 w-4 mr-2" />
            Acknowledged
          </TabsTrigger>
        </TabsList>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="cell">Cells</SelectItem>
                <SelectItem value="string">Strings</SelectItem>
                <SelectItem value="bank">Battery Banks</SelectItem>
                <SelectItem value="charger">Chargers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {activeTab === "active" && (
            <Button 
              variant="outline"
              onClick={handleAcknowledge}
              disabled={selectedAlerts.length === 0}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Acknowledge Selected
            </Button>
          )}
        </div>
        
        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>
                Alerts requiring attention and acknowledgment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeLoading ? (
                <div className="flex justify-center py-8">
                  <div className="text-muted-foreground">Loading alerts...</div>
                </div>
              ) : activeError ? (
                <div className="flex justify-center py-8 text-scope-danger">
                  Error loading alerts. Please try again.
                </div>
              ) : filteredAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-3">
                  <CheckCircle className="h-10 w-10 text-scope-success" />
                  <div className="text-center">
                    <h3 className="text-lg font-medium">All Clear</h3>
                    <p className="text-muted-foreground">
                      No active alerts matching your filter criteria
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40px] text-center">
                          <Checkbox 
                            checked={selectedAlerts.length === filteredAlerts.length && filteredAlerts.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="w-[120px]">Severity</TableHead>
                        <TableHead className="w-[150px]">Time</TableHead>
                        <TableHead className="w-[150px]">Source</TableHead>
                        <TableHead>Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAlerts.map((alert) => (
                        <TableRow key={alert.id}>
                          <TableCell className="text-center">
                            <Checkbox 
                              checked={selectedAlerts.includes(alert.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedAlerts([...selectedAlerts, alert.id]);
                                } else {
                                  setSelectedAlerts(selectedAlerts.filter(id => id !== alert.id));
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Badge variant={alert.severity === 'critical' ? 'destructive' : 'warning'}>
                              {alert.severity === 'critical' ? 'Critical' : 'Warning'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(alert.created_at), 'MMM dd, HH:mm')}
                          </TableCell>
                          <TableCell>
                            {formatSource(alert.source_type, alert.source_id)}
                          </TableCell>
                          <TableCell>{alert.message}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="acknowledged" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Acknowledged Alerts</CardTitle>
              <CardDescription>
                Historical record of acknowledged alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {acknowledgedLoading ? (
                <div className="flex justify-center py-8">
                  <div className="text-muted-foreground">Loading alerts...</div>
                </div>
              ) : acknowledgedError ? (
                <div className="flex justify-center py-8 text-scope-danger">
                  Error loading alerts. Please try again.
                </div>
              ) : filteredAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-3">
                  <Clock className="h-10 w-10 text-muted-foreground" />
                  <div className="text-center">
                    <h3 className="text-lg font-medium">No History</h3>
                    <p className="text-muted-foreground">
                      No acknowledged alerts matching your filter criteria
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Severity</TableHead>
                        <TableHead className="w-[150px]">Time</TableHead>
                        <TableHead className="w-[150px]">Source</TableHead>
                        <TableHead>Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAlerts.map((alert) => (
                        <TableRow key={alert.id}>
                          <TableCell>
                            <Badge variant={alert.severity === 'critical' ? 'destructive' : 'warning'}>
                              {alert.severity === 'critical' ? 'Critical' : 'Warning'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(alert.created_at), 'MMM dd, HH:mm')}
                          </TableCell>
                          <TableCell>
                            {formatSource(alert.source_type, alert.source_id)}
                          </TableCell>
                          <TableCell>{alert.message}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Alerts;
