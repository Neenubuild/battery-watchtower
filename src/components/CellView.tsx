
import { Cell } from "@/hooks/useBatteryData";
import { StatusIndicator } from "@/components/StatusIndicator";
import { cn } from "@/lib/utils";

interface CellViewProps {
  cell: Cell;
  index: number;
  onCellClick?: (cell: Cell) => void;
}

export function CellView({ cell, index, onCellClick }: CellViewProps) {
  // Determine if cell is in warning or critical state
  const isWarning = cell.status === "warning";
  const isCritical = cell.status === "critical";
  const isOffline = cell.status === "offline";
  
  return (
    <div
      className={cn(
        "border rounded-md p-2 hover:bg-secondary/50 cursor-pointer transition-colors",
        isWarning && "border-scope-warning",
        isCritical && "border-scope-danger",
        isOffline && "border-scope-gray bg-scope-lightGray/20",
      )}
      onClick={() => onCellClick?.(cell)}
    >
      <div className="flex justify-between items-center mb-1">
        <div className="font-medium text-sm">Cell {index + 1}</div>
        <StatusIndicator status={cell.status} />
      </div>
      <div className="grid grid-cols-2 gap-1 text-xs">
        <div className="text-muted-foreground">Voltage:</div>
        <div className={cn(
          isWarning && "text-scope-warning font-medium",
          isCritical && "text-scope-danger font-medium",
          isOffline && "text-scope-gray",
        )}>
          {isOffline ? "N/A" : `${cell.voltage.toFixed(3)}V`}
        </div>
        <div className="text-muted-foreground">Temp:</div>
        <div className={cn(
          isWarning && "text-scope-warning font-medium",
          isCritical && "text-scope-danger font-medium",
          isOffline && "text-scope-gray",
        )}>
          {isOffline ? "N/A" : `${cell.temperature.toFixed(1)}°C`}
        </div>
      </div>
    </div>
  );
}
