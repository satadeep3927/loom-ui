import { Layout } from "@/components/layout";
import { Dashboard } from "@/pages/dashboard";
import { EventsPage } from "@/pages/events";
import { LogsPage } from "@/pages/logs";
import { StatsPage } from "@/pages/stats";
import { TasksPage } from "@/pages/tasks";
import { WorkflowDetailPage } from "@/pages/workflow-detail";
import { WorkflowsPage } from "@/pages/workflows";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000, // 30 seconds
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="workflows" element={<WorkflowsPage />} />
            <Route path="workflows/:id" element={<WorkflowDetailPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="logs" element={<LogsPage />} />
            <Route path="stats" element={<StatsPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
}

export default App;
