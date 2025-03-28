
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIndicator } from "@/components/StatusIndicator";
import { BatteryLevel } from "@/components/BatteryLevel";
import { BatteryBank } from "@/hooks/useBatteryData";
import { Thermometer } from "lucide-react";

interface BatteryBankCardProps {
  bank: BatteryBank;
}

export function BatteryBankCard({ bank }: BatteryBankCardProps) {
  const totalAlerts = bank.strings.reduce(
    (count, string) => count + string.alerts.length,
    0
  );
  
  // Calculate average SoC across all strings
  const averageSoC = bank.strings.reduce(
    (sum, string) => sum + string.stateOfCharge,
    0
  ) / bank.strings.length;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center">
            {bank.name}
            <StatusIndicator status={bank.status} className="ml-2" />
          </CardTitle>
          <div className="flex items-center bg-secondary px-2 py-1 rounded text-sm">
            <Thermometer className="h-4 w-4 mr-1 text-scope-orange" />
            {bank.temperature.toFixed(1)}°C
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Location: {bank.location}
          </div>
          
          <div className="text-sm text-muted-foreground">
            Install Date: {bank.installDate}
          </div>
          
          <div className="mt-4">
            <div className="text-sm font-medium mb-1">State of Charge</div>
            <BatteryLevel percentage={averageSoC} />
          </div>
          
          <div className="space-y-2">
            {bank.strings.map((string) => (
              <div key={string.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  {string.name}
                  <StatusIndicator status={string.status} className="ml-2" />
                </div>
                <div>
                  {string.voltage.toFixed(1)}V / {string.current.toFixed(1)}A
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        <div className="w-full text-sm">
          {totalAlerts > 0 ? (
            <div className="text-scope-danger">
              {totalAlerts} active alert{totalAlerts !== 1 ? "s" : ""}
            </div>
          ) : (
            <div className="text-scope-success">No active alerts</div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
