
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIndicator } from "@/components/StatusIndicator";
import { Charger } from "@/hooks/useBatteryData";

interface ChargerCardProps {
  charger: Charger;
}

export function ChargerCard({ charger }: ChargerCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            {charger.name}
            <StatusIndicator status={charger.status} className="ml-2" />
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm">
              <div className="text-muted-foreground">Input AC</div>
              <div>{charger.inputACVoltage.toFixed(1)} V</div>
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground">Output DC</div>
              <div>{charger.outputDCVoltage.toFixed(1)} V</div>
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground">Current</div>
              <div>{charger.outputDCCurrent.toFixed(1)} A</div>
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground">Power Factor</div>
              <div>{charger.powerFactor.toFixed(2)}</div>
            </div>
            <div className="text-sm col-span-2">
              <div className="text-muted-foreground">Efficiency</div>
              <div>{charger.efficiency.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        <div className="w-full text-sm">
          {charger.alerts.length > 0 ? (
            <div className="text-scope-danger">
              {charger.alerts.length} active alert{charger.alerts.length !== 1 ? "s" : ""}
            </div>
          ) : (
            <div className="text-scope-success">No active alerts</div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
