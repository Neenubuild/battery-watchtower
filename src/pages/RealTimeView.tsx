
import { useState } from "react";
import { useBatteryData, BatteryBank, BatteryString, Charger } from "@/hooks/useBatteryData";
import { StringView } from "@/components/StringView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud } from "lucide-react";

const RealTimeView = () => {
  const { data, loading, error } = useBatteryData(3000); // More frequent updates for real-time view
  
  const [selectedBankId, setSelectedBankId] = useState<string>("");
  const [selectedChargerId, setSelectedChargerId] = useState<string>("");
  
  // Set initial selection when data loads
  if (!loading && data && data.batteryBanks.length > 0 && !selectedBankId) {
    setSelectedBankId(data.batteryBanks[0].id);
  }
  
  if (!loading && data && data.chargers.length > 0 && !selectedChargerId) {
    setSelectedChargerId(data.chargers[0].id);
  }
  
  const selectedBank = data?.batteryBanks.find(bank => bank.id === selectedBankId);
  const selectedCharger = data?.chargers.find(charger => charger.id === selectedChargerId);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Real-Time Monitoring</h1>
        <div className="flex items-center space-x-2 text-sm">
          <Cloud className="h-4 w-4 text-scope-success" />
          <span>Live Data <span className="live-indicator"></span></span>
        </div>
      </div>
      
      <Tabs defaultValue="battery">
        <TabsList>
          <TabsTrigger value="battery">Battery System</TabsTrigger>
          <TabsTrigger value="charger">Charger System</TabsTrigger>
        </TabsList>
        
        <TabsContent value="battery" className="mt-4">
          {loading && !data ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : error ? (
            <div className="text-scope-danger">Error loading battery data: {error}</div>
          ) : (
            <>
              <div className="mb-6">
                <Select
                  value={selectedBankId}
                  onValueChange={setSelectedBankId}
                >
                  <SelectTrigger className="w-full sm:w-64">
                    <SelectValue placeholder="Select battery bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.batteryBanks.map((bank) => (
                      <SelectItem key={bank.id} value={bank.id}>
                        {bank.name} ({bank.location})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedBank && (
                <div>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm font-medium">Bank Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span>{selectedBank.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Install Date:</span>
                            <span>{selectedBank.installDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Temperature:</span>
                            <span>{selectedBank.temperature.toFixed(1)}°C</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Strings:</span>
                            <span>{selectedBank.strings.length}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-8">
                    {selectedBank.strings.map((string) => (
                      <StringView key={string.id} string={string} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="charger" className="mt-4">
          {loading && !data ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : error ? (
            <div className="text-scope-danger">Error loading charger data: {error}</div>
          ) : (
            <>
              <div className="mb-6">
                <Select
                  value={selectedChargerId}
                  onValueChange={setSelectedChargerId}
                >
                  <SelectTrigger className="w-full sm:w-64">
                    <SelectValue placeholder="Select charger" />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.chargers.map((charger) => (
                      <SelectItem key={charger.id} value={charger.id}>
                        {charger.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedCharger && (
                <div className="space-y-6">
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm font-medium">Input AC Voltage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {selectedCharger.inputACVoltage.toFixed(1)} <span className="text-base font-normal">V</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Nominal: 220-240V
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm font-medium">Output DC Voltage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {selectedCharger.outputDCVoltage.toFixed(1)} <span className="text-base font-normal">V</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Nominal: 48-52V
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm font-medium">Output DC Current</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {selectedCharger.outputDCCurrent.toFixed(1)} <span className="text-base font-normal">A</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Max: 25A
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm font-medium">Power Factor</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {selectedCharger.powerFactor.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Ideal: &gt;0.95
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Charger Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-y-2">
                          <div className="text-muted-foreground">Status:</div>
                          <div className="flex items-center">
                            <div className={`status-indicator ${
                              selectedCharger.status === 'normal' ? 'status-normal' : 
                              selectedCharger.status === 'warning' ? 'status-warning' :
                              selectedCharger.status === 'critical' ? 'status-critical' : 'status-offline'
                            } mr-2`}></div>
                            <span className="capitalize">{selectedCharger.status}</span>
                          </div>
                          
                          <div className="text-muted-foreground">Efficiency:</div>
                          <div>{selectedCharger.efficiency.toFixed(1)}%</div>
                          
                          <div className="text-muted-foreground">Active Alerts:</div>
                          <div>
                            {selectedCharger.alerts.length === 0 ? (
                              <span className="text-scope-success">None</span>
                            ) : (
                              <span className="text-scope-danger">{selectedCharger.alerts.length} active</span>
                            )}
                          </div>
                        </div>
                        
                        {selectedCharger.alerts.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Alert Details</h4>
                            <ul className="list-disc pl-6 space-y-1">
                              {selectedCharger.alerts.map((alert, index) => (
                                <li key={index} className="text-scope-danger">{alert}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealTimeView;
