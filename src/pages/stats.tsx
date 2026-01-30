import { useSystemStats } from '@/lib/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, CheckCircle2, XCircle, Clock, Loader2, Ban } from 'lucide-react';

export function StatsPage() {
  const { data: stats, isLoading } = useSystemStats();

  if (isLoading) {
    return <StatsSkeleton />;
  }

  if (!stats) {
    return null;
  }

  const workflowSuccessRate = stats.workflows.total
    ? ((stats.workflows.completed / stats.workflows.total) * 100).toFixed(1)
    : 0;

  const taskSuccessRate = stats.tasks.total
    ? ((stats.tasks.completed / stats.tasks.total) * 100).toFixed(1)
    : 0;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
        <p className="text-muted-foreground">System metrics and performance data</p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.workflows.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.tasks.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.events}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.logs}</div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Running</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">{stats.workflows.running}</span>
                <div className="w-32 bg-secondary rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${
                        stats.workflows.total
                          ? (stats.workflows.running / stats.workflows.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-medium">Completed</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">{stats.workflows.completed}</span>
                <div className="w-32 bg-secondary rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        stats.workflows.total
                          ? (stats.workflows.completed / stats.workflows.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="font-medium">Failed</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">{stats.workflows.failed}</span>
                <div className="w-32 bg-secondary rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${
                        stats.workflows.total
                          ? (stats.workflows.failed / stats.workflows.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ban className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Canceled</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">{stats.workflows.canceled}</span>
                <div className="w-32 bg-secondary rounded-full h-2">
                  <div
                    className="bg-gray-500 h-2 rounded-full"
                    style={{
                      width: `${
                        stats.workflows.total
                          ? (stats.workflows.canceled / stats.workflows.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Success Rate</span>
                <span className="text-2xl font-bold text-green-500">{workflowSuccessRate}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Task Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Pending</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">{stats.tasks.pending}</span>
                <div className="w-32 bg-secondary rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${
                        stats.tasks.total ? (stats.tasks.pending / stats.tasks.total) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Running</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">{stats.tasks.running}</span>
                <div className="w-32 bg-secondary rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${
                        stats.tasks.total ? (stats.tasks.running / stats.tasks.total) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-medium">Completed</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">{stats.tasks.completed}</span>
                <div className="w-32 bg-secondary rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        stats.tasks.total ? (stats.tasks.completed / stats.tasks.total) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="font-medium">Failed</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">{stats.tasks.failed}</span>
                <div className="w-32 bg-secondary rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${
                        stats.tasks.total ? (stats.tasks.failed / stats.tasks.total) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Success Rate</span>
                <span className="text-2xl font-bold text-green-500">{taskSuccessRate}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <Skeleton className="h-10 w-48" />
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
