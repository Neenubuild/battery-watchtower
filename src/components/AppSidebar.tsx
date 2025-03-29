
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
      path: "/dashboard",
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
    <Sidebar className="bg-slate-800">
      <SidebarHeader className="flex items-center justify-center py-6 bg-slate-700">
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
                    `text-white hover:text-scope-orange ${
                      isActive ? "text-scope-orange" : ""
                    }`
                  }
                  end={item.path === "/"}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="py-4 px-4 text-xs text-center text-gray-300">
        <div className="flex items-center justify-center mb-2 text-white">
          <Cloud className="h-4 w-4 mr-1" /> <span>Connected</span>
        </div>
        <div className="text-white">SCOPE BMS v1.0.0</div>
      </SidebarFooter>
    </Sidebar>
  );
}
