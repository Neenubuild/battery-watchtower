
import React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StatusIndicatorProps {
  status: "normal" | "warning" | "critical" | "offline";
  showLabel?: boolean;
  className?: string;
}

export function StatusIndicator({ status, showLabel = false, className }: StatusIndicatorProps) {
  const statusClasses = {
    normal: "bg-scope-success",
    warning: "bg-scope-warning",
    critical: "bg-scope-danger",
    offline: "bg-scope-gray",
  };

  const statusLabels = {
    normal: "Normal",
    warning: "Warning",
    critical: "Critical",
    offline: "Offline",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            <span
              className={cn(
                "inline-block w-3 h-3 rounded-full",
                statusClasses[status],
                className
              )}
            />
            {showLabel && (
              <span className="ml-2 text-xs">{statusLabels[status]}</span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{statusLabels[status]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
