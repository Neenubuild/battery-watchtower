
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Header } from "@/components/Header";

const Layout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          <div className="mx-auto max-w-7xl">
            <SidebarTrigger className="lg:hidden mb-4" />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
