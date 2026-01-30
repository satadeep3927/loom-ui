import { useState } from 'react';
import { useTasks } from '@/lib/queries';
import { TaskStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/status-badge';
import { formatDate, formatRelativeTime } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function TasksPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<TaskStatus | 'ALL'>('ALL');
  const perPage = 20;

  const { data, isLoading } = useTasks({
    page,
    per_page: perPage,
    status: status === 'ALL' ? undefined : status,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Monitor task execution and queue status</p>
        </div>
        <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus | 'ALL')}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value={TaskStatus.PENDING}>Pending</SelectItem>
            <SelectItem value={TaskStatus.RUNNING}>Running</SelectItem>
            <SelectItem value={TaskStatus.COMPLETED}>Completed</SelectItem>
            <SelectItem value={TaskStatus.FAILED}>Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {data?.meta.total || 0} Task{data?.meta.total !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : data?.data.length ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Target</TableHead>
                    <TableHead>Workflow</TableHead>
                    <TableHead>Kind</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((task) => (
                    <TableRow key={task.id} className="hover:bg-accent/50">
                      <TableCell>
                        <div className="font-medium">{task.target}</div>
                        <div className="text-xs text-muted-foreground font-mono">{task.id}</div>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/workflows/${task.workflow_id}`}
                          className="text-sm hover:underline text-blue-500"
                        >
                          {task.workflow_name || task.workflow_id}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{task.kind}</Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={task.status} />
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{task.attempts}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(task.created_at)}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatRelativeTime(task.created_at)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {data.meta.pages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {data.meta.page} of {data.meta.pages} ({data.meta.total} total)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!data.meta.has_prev}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!data.meta.has_next}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tasks found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
