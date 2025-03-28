
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, User, LogOut, Settings, UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const [alerts, setAlerts] = useState<number>(0);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [userDisplayName, setUserDisplayName] = useState<string>("");

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

    // Get user profile information
    if (user) {
      const getUserProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setUserDisplayName(data.display_name || user.email?.split('@')[0] || "User");
        }
      };
      
      getUserProfile();
    }

    return () => {
      clearInterval(timer);
      clearInterval(alertTimer);
    };
  }, [alerts, toast, user]);

  const clearAlerts = () => {
    setAlerts(0);
    toast({
      title: "Alerts Cleared",
      description: "All alerts have been acknowledged",
    });
  };
  
  const handleSignOut = async () => {
    await signOut();
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
              <Button variant="ghost" size="icon" className="relative">
                <UserCircle className="h-5 w-5" />
                {user && (
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user ? (
                <>
                  <div className="px-2 py-1.5 text-sm font-medium text-center border-b">
                    {userDisplayName || user.email?.split('@')[0] || "User"}
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/configuration" className="cursor-pointer flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/auth" className="cursor-pointer">
                      Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/auth?tab=signup" className="cursor-pointer">
                      Create Account
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
