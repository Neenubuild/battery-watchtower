
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";

import Dashboard from "@/pages/Dashboard";
import RealTimeView from "@/pages/RealTimeView";
import Configuration from "@/pages/Configuration";
import Alerts from "@/pages/Alerts";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/NotFound";
import Layout from "@/components/Layout";

// Create a new query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      refetchOnWindowFocus: true,
      retry: 1,
      refetchInterval: 60 * 1000, // Poll every minute
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SidebarProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="real-time" element={<RealTimeView />} />
              <Route path="configuration" element={<Configuration />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="reports" element={<Reports />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SidebarProvider>
  </QueryClientProvider>
);

export default App;
