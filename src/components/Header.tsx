
import { useState, useEffect } from "react";
import { Bell, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<number>(0);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Update the date time every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Simulate receiving new alerts
    const alertTimer = setInterval(() => {
      // Random chance of new alert
      if (Math.random() > 0.8) {
        const newAlertCount = alerts + 1;
        setAlerts(newAlertCount);
        
        if (newAlertCount === 1) {
          toast({
            title: "New Alert",
            description: "High temperature detected in Battery Bank 2",
            variant: "destructive",
          });
        }
      }
    }, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(alertTimer);
    };
  }, [alerts, toast]);

  const clearAlerts = () => {
    setAlerts(0);
    toast({
      title: "Alerts Cleared",
      description: "All alerts have been acknowledged",
    });
  };

  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center px-4 justify-between">
        <div className="font-semibold">
          SCOPE Battery Management System
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground hidden md:block">
            {currentDateTime.toLocaleString()}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {alerts > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
                  >
                    {alerts}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {alerts > 0 ? (
                <>
                  <DropdownMenuItem className="text-destructive">
                    High temperature: Battery Bank 2
                  </DropdownMenuItem>
                  {alerts > 1 && (
                    <DropdownMenuItem className="text-destructive">
                      Low voltage: Cell B2-04
                    </DropdownMenuItem>
                  )}
                  {alerts > 2 && (
                    <DropdownMenuItem className="text-destructive">
                      Charger Fault: Charger 1
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={clearAlerts} className="justify-center text-center">
                    Clear All
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem disabled>No new alerts</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
