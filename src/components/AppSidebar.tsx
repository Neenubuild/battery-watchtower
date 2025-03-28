
import { NavLink } from "react-router-dom";
import {
  Database,
  Settings,
  Cloud,
  Bell,
  FileText,
  Wifi,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/Logo";

export function AppSidebar() {
  const menuItems = [
    {
      title: "Dashboard",
      icon: Database,
      path: "/",
    },
    {
      title: "Real-Time View",
      icon: Wifi,
      path: "/real-time",
    },
    {
      title: "Configuration",
      icon: Settings,
      path: "/configuration",
    },
    {
      title: "Alerts",
      icon: Bell,
      path: "/alerts",
    },
    {
      title: "Reports",
      icon: FileText,
      path: "/reports",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-6">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? "text-scope-orange" : ""
                  }
                  end={item.path === "/"}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="py-4 px-4 text-xs text-center">
        <div className="flex items-center justify-center mb-2">
          <Cloud className="h-4 w-4 mr-1" /> <span>Connected</span>
        </div>
        <div>SCOPE BMS v1.0.0</div>
      </SidebarFooter>
    </Sidebar>
  );
}
