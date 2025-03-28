
import { useState } from "react";
import { BatteryString, Cell } from "@/hooks/useBatteryData";
import { CellView } from "@/components/CellView";
import { StatusIndicator } from "@/components/StatusIndicator";
import { BatteryLevel } from "@/components/BatteryLevel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StringViewProps {
  string: BatteryString;
}

export function StringView({ string }: StringViewProps) {
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  
  const handleCellClick = (cell: Cell) => {
    setSelectedCell(cell);
  };
  
  const handleDialogClose = () => {
    setSelectedCell(null);
  };
  
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <h3 className="text-xl font-semibold">{string.name}</h3>
        <StatusIndicator status={string.status} className="ml-2 w-4 h-4" />
        <div className="text-xs bg-secondary rounded-full px-2 py-0.5 ml-3">
          {string.cells.length} cells
        </div>
        <div className="live-indicator" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="bg-card rounded-md p-3 border">
          <div className="text-sm text-muted-foreground">String Voltage</div>
          <div className="text-xl font-semibold">{string.voltage.toFixed(1)}V</div>
        </div>
        <div className="bg-card rounded-md p-3 border">
          <div className="text-sm text-muted-foreground">Current</div>
          <div className="text-xl font-semibold">{string.current.toFixed(1)}A</div>
        </div>
        <div className="bg-card rounded-md p-3 border col-span-2 sm:col-span-1">
          <div className="text-sm text-muted-foreground mb-1">State of Charge</div>
          <BatteryLevel percentage={string.stateOfCharge} showLabel={true} />
        </div>
      </div>
      
      {string.alerts.length > 0 && (
        <Accordion type="single" collapsible className="mb-4">
          <AccordionItem value="alerts">
            <AccordionTrigger>
              <span className="text-scope-danger">
                {string.alerts.length} Active Alert{string.alerts.length !== 1 ? "s" : ""}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-1">
                {string.alerts.map((alert, index) => (
                  <li key={index} className="text-scope-danger">{alert}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {string.cells.map((cell, index) => (
          <CellView 
            key={cell.id} 
            cell={cell} 
            index={index} 
            onCellClick={handleCellClick}
          />
        ))}
      </div>
      
      <Dialog open={selectedCell !== null} onOpenChange={handleDialogClose}>
        <DialogContent>
          {selectedCell && (
            <>
              <DialogHeader>
                <DialogTitle>Cell Details</DialogTitle>
                <DialogDescription>
                  ID: {selectedCell.id}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                <div className="flex justify-between items-center">
                  <div>Status</div>
                  <StatusIndicator status={selectedCell.status} showLabel={true} />
                </div>
                
                <div className="grid grid-cols-2 gap-y-2">
                  <div>Voltage</div>
                  <div className="font-semibold">{selectedCell.voltage.toFixed(3)}V</div>
                  
                  <div>Temperature</div>
                  <div className="font-semibold">{selectedCell.temperature.toFixed(1)}°C</div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Thresholds</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Voltage Warning:</span>
                      <span>&lt; 2.00V</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Voltage Critical:</span>
                      <span>&lt; 1.98V</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Temperature Warning:</span>
                      <span>&gt; 32°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Temperature Critical:</span>
                      <span>&gt; 34°C</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
