
import React from "react";
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" className="flex flex-col items-center">
      <img
        src="/lovable-uploads/33d81b40-bec4-46e8-9707-d9934b38f1a6.png"
        alt="SCOPE Logo"
        className="h-12 mb-1"
      />
      <div className="text-xs text-center text-muted-foreground mt-1">
        Remote BMS & BCMS
      </div>
    </Link>
  );
}
