
import React from "react";
import { cn } from "@/lib/utils";

interface BatteryLevelProps {
  percentage: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function BatteryLevel({
  percentage,
  className,
  showLabel = true,
  size = "md",
}: BatteryLevelProps) {
  // Ensure percentage is between 0 and 100
  const safePercentage = Math.min(100, Math.max(0, percentage));
  
  // Determine status based on percentage
  let statusClass = "bg-scope-success";
  if (safePercentage < 20) {
    statusClass = "bg-scope-danger";
  } else if (safePercentage < 50) {
    statusClass = "bg-scope-warning";
  }
  
  // Size classes
  const sizeClasses = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6",
  };
  
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className={cn("relative w-full bg-scope-lightGray rounded overflow-hidden", sizeClasses[size])}>
        <div
          className={cn("absolute h-full left-0 top-0", statusClass)}
          style={{ width: `${safePercentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium w-10 text-right">{Math.round(safePercentage)}%</span>
      )}
    </div>
  );
}
