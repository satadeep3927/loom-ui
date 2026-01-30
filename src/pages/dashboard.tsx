import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSystemStats, useRecentLogs, useWorkflows } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Workflow,
  ListTodo,
} from "lucide-react";
import { LogLevelBadge } from "@/components/status-badge";
import { formatRelativeTime } from "@/lib/format";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useSystemStats();
  const { data: recentLogs, isLoading: logsLoading } = useRecentLogs({
    per_page: 10,
  });
  const { data: workflows, isLoading: workflowsLoading } = useWorkflows({
    per_page: 5,
    sort_by: "updated_at",
    sort_order: "desc",
  });

  if (statsLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your workflow orchestration system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Workflows
            </CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.workflows.total || 0}
            </div>
            <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                {stats?.workflows.running || 0} running
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {stats?.workflows.completed || 0} done
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.tasks.total || 0}</div>
            <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {stats?.tasks.pending || 0} pending
              </span>
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                {stats?.tasks.running || 0} running
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.workflows.total
                ? (
                    (stats.workflows.completed / stats.workflows.total) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Workflow completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Failed Workflows
            </CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.workflows.failed || 0}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Recent Workflows */}
        <Card className="flex flex-col w-full">
          <CardHeader>
            <CardTitle>Recent Workflows</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {workflowsLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : workflows?.data && workflows.data.length > 0 ? (
              <div className="space-y-2">
                {workflows.data.map((workflow) => (
                  <Link
                    key={workflow.id}
                    to={`/workflows/${workflow.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{workflow.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(workflow.created_at)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        workflow.status === "COMPLETED" ? "outline" : "default"
                      }
                      className={
                        workflow.status === "RUNNING"
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          : workflow.status === "COMPLETED"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : workflow.status === "FAILED"
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : ""
                      }
                    >
                      {workflow.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No workflows found
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Logs */}
        <Card className="flex flex-col w-full">
          <CardHeader>
            <CardTitle>Recent Logs</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {logsLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentLogs?.data && recentLogs.data.length > 0 ? (
              <div className="space-y-2">
                {recentLogs.data.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <LogLevelBadge level={log.level} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{log.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(log.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No logs found
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-32 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
