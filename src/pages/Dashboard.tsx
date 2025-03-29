
import { useBatteryData } from "@/hooks/useBatteryData";
import { useRealBatteryData } from "@/hooks/useRealBatteryData";
import { BatteryBankCard } from "@/components/BatteryBankCard";
import { ChargerCard } from "@/components/ChargerCard";
import { BatteryHistoryChart } from "@/components/BatteryHistoryChart";
import { BatteryLoadChart } from "@/components/BatteryLoadChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Cloud, Bell, Info } from "lucide-react";

const Dashboard = () => {
  const { data, loading, error } = useBatteryData(5000); // Update every 5 seconds
  
  const totalBanks = data?.batteryBanks.length || 0;
  const totalChargers = data?.chargers.length || 0;
  
  const warningBanks = data?.batteryBanks.filter(bank => bank.status === "warning").length || 0;
  const criticalBanks = data?.batteryBanks.filter(bank => bank.status === "critical").length || 0;
  
  const warningChargers = data?.chargers.filter(charger => charger.status === "warning").length || 0;
  const criticalChargers = data?.chargers.filter(charger => charger.status === "critical").length || 0;
  
  const totalAlerts = data?.batteryBanks.reduce(
    (count, bank) => count + bank.strings.reduce(
      (stringCount, string) => stringCount + string.alerts.length, 
      0
    ), 
    0
  ) || 0;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm">
          <Cloud className="h-4 w-4 text-scope-success" />
          <span>Last updated: {data ? new Date(data.lastUpdated).toLocaleTimeString() : "--:--:--"}</span>
        </div>
      </div>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex justify-between">
            <h3 className="font-semibold">Battery Banks</h3>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-2" />
          ) : (
            <div className="mt-2 flex items-end justify-between">
              <div className="text-3xl font-bold">{totalBanks}</div>
              <div className="flex items-center space-x-2 text-sm">
                {warningBanks > 0 && (
                  <div className="text-scope-warning">{warningBanks} warning</div>
                )}
                {criticalBanks > 0 && (
                  <div className="text-scope-danger">{criticalBanks} critical</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-card rounded-lg border p-4">
          <div className="flex justify-between">
            <h3 className="font-semibold">Chargers</h3>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-2" />
          ) : (
            <div className="mt-2 flex items-end justify-between">
              <div className="text-3xl font-bold">{totalChargers}</div>
              <div className="flex items-center space-x-2 text-sm">
                {warningChargers > 0 && (
                  <div className="text-scope-warning">{warningChargers} warning</div>
                )}
                {criticalChargers > 0 && (
                  <div className="text-scope-danger">{criticalChargers} critical</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-card rounded-lg border p-4">
          <div className="flex justify-between">
            <h3 className="font-semibold">Active Alerts</h3>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </div>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-2" />
          ) : (
            <div className="mt-2 flex items-end justify-between">
              <div className="text-3xl font-bold">{totalAlerts}</div>
              <div className="text-sm text-muted-foreground">Last 24 hours</div>
            </div>
          )}
        </div>
        
        <div className="bg-card rounded-lg border p-4">
          <div className="flex justify-between">
            <h3 className="font-semibold">System Status</h3>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
          {loading ? (
            <Skeleton className="h-8 w-full mt-2" />
          ) : (
            <div className="mt-2">
              {totalAlerts > 0 ? (
                <div className="flex items-center">
                  <div className="status-indicator status-warning mr-2"></div>
                  <div className="text-scope-warning font-medium">Requires Attention</div>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="status-indicator status-normal mr-2"></div>
                  <div className="text-scope-success font-medium">All Systems Normal</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <BatteryHistoryChart />
        <BatteryLoadChart />
      </div>
      
      <Tabs defaultValue="battery-banks">
        <TabsList>
          <TabsTrigger value="battery-banks">Battery Banks</TabsTrigger>
          <TabsTrigger value="chargers">Chargers</TabsTrigger>
        </TabsList>
        <TabsContent value="battery-banks" className="mt-4">
          {loading ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-scope-danger">Error loading battery data: {error}</div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {data.batteryBanks.map(bank => (
                <BatteryBankCard key={bank.id} bank={bank} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="chargers" className="mt-4">
          {loading ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2].map(i => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-scope-danger">Error loading charger data: {error}</div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {data.chargers.map(charger => (
                <ChargerCard key={charger.id} charger={charger} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
