
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TimelineList from "./pages/TimelineList";
import Timeline from "./components/timeline/Timeline";
import AppSidebar from "./components/AppSidebar";

// Placeholder pages for the new menu items
import CustomerSegments from "./pages/CustomerSegments";
import Customers from "./pages/Customers";
import Statements from "./pages/Statements";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <SidebarInset className="flex-1">
              <div className="container p-4">
                <div className="flex items-center mb-4">
                  <SidebarTrigger className="mr-4" />
                  <h1 className="text-2xl font-bold">Timeline Management</h1>
                </div>
                <Routes>
                  <Route path="/" element={<TimelineList />} />
                  <Route path="/timeline/:id" element={<Timeline />} />
                  <Route path="/legacy" element={<Index />} />
                  <Route path="/customer-segments" element={<CustomerSegments />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/statements" element={<Statements />} />
                  <Route path="/settings" element={<Settings />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
