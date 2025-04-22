
import React, { lazy, Suspense } from 'react';
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
import CustomerTimeline from "./pages/CustomerTimeline";
import Statements from "./pages/Statements";
import Settings from "./pages/Settings";
import Actions from "./pages/Actions";

// Lazy load the CollectionTimelinePerformance component
const CollectionTimelinePerformance = lazy(() => import('./pages/CollectionTimelinePerformance'));

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
                  <Route path="/customer-timeline" element={<CustomerTimeline />} />
                  <Route path="/statements" element={<Statements />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/actions" element={<Actions />} />
                  <Route path="/collection-timeline-performance" element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <CollectionTimelinePerformance />
                    </Suspense>
                  } />
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
