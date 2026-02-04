import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Workflow,
  ListTodo,
  Activity,
  FileText,
  BarChart3,
} from "lucide-react";

import Logo from "@/assets/logo-white.png";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Workflows", href: "/workflows", icon: Workflow },
  { name: "Tasks", href: "/tasks", icon: ListTodo },
  { name: "Events", href: "/events", icon: Activity },
  { name: "Logs", href: "/logs", icon: FileText },
  { name: "Statistics", href: "/stats", icon: BarChart3 },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <img src={Logo} alt="LOOM Monitor Logo" className="w-25" />
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <div className="rounded-lg bg-muted p-3 text-xs">
          <p className="font-semibold">API Endpoint</p>
          <p className="mt-1 text-muted-foreground">
            {import.meta.env.VITE_API_URL || "http://localhost:8000"}
          </p>
        </div>
      </div>
    </div>
  );
}
