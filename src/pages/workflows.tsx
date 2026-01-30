import { useState } from 'react';
import { useWorkflows } from '@/lib/queries';
import { WorkflowStatus } from '@/lib/types';
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
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function WorkflowsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<WorkflowStatus | 'ALL'>('ALL');
  const perPage = 20;

  const { data, isLoading } = useWorkflows({
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
          <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground">Monitor and manage workflow executions</p>
        </div>
        <Select value={status} onValueChange={(value) => setStatus(value as WorkflowStatus | 'ALL')}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value={WorkflowStatus.RUNNING}>Running</SelectItem>
            <SelectItem value={WorkflowStatus.COMPLETED}>Completed</SelectItem>
            <SelectItem value={WorkflowStatus.FAILED}>Failed</SelectItem>
            <SelectItem value={WorkflowStatus.CANCELED}>Canceled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {data?.meta.total || 0} Workflow{data?.meta.total !== 1 ? 's' : ''}
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
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Events</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((workflow) => (
                    <TableRow key={workflow.id} className="cursor-pointer hover:bg-accent/50">
                      <TableCell>
                        <Link
                          to={`/workflows/${workflow.id}`}
                          className="font-medium hover:underline"
                        >
                          {workflow.name}
                        </Link>
                        {workflow.version && (
                          <div className="text-xs text-muted-foreground">v{workflow.version}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={workflow.status} />
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(workflow.created_at)}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatRelativeTime(workflow.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {workflow.updated_at ? (
                          <>
                            <div className="text-sm">{formatDate(workflow.updated_at)}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatRelativeTime(workflow.updated_at)}
                            </div>
                          </>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {workflow.event_count || 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
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
              <p className="text-muted-foreground">No workflows found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
