import { useState } from 'react';
import { useEvents } from '@/lib/queries';
import { EventType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { ScrollArea } from '@/components/ui/scroll-area';

export function EventsPage() {
  const [page, setPage] = useState(1);
  const [eventType, setEventType] = useState<EventType | 'ALL'>('ALL');
  const perPage = 20;

  const { data, isLoading } = useEvents({
    page,
    per_page: perPage,
    type: eventType === 'ALL' ? undefined : eventType,
    sort_by: 'id',
    sort_order: 'desc',
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">Event sourcing audit trail</p>
        </div>
        <Select value={eventType} onValueChange={(value) => setEventType(value as EventType | 'ALL')}>
          <SelectTrigger className="w-55">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value={EventType.WORKFLOW_STARTED}>Workflow Started</SelectItem>
            <SelectItem value={EventType.WORKFLOW_COMPLETED}>Workflow Completed</SelectItem>
            <SelectItem value={EventType.WORKFLOW_FAILED}>Workflow Failed</SelectItem>
            <SelectItem value={EventType.STEP_START}>Step Start</SelectItem>
            <SelectItem value={EventType.STEP_COMPLETE}>Step Complete</SelectItem>
            <SelectItem value={EventType.STEP_FAILED}>Step Failed</SelectItem>
            <SelectItem value={EventType.STATE_SET}>State Set</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {data?.meta.total || 0} Event{data?.meta.total !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : data?.data.length ? (
            <>
              <ScrollArea className="h-150">
                <div className="space-y-3">
                  {data.data.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">
                            {event.type}
                          </Badge>
                          <Link
                            to={`/workflows/${event.workflow_id}`}
                            className="text-sm text-blue-500 hover:underline"
                          >
                            Workflow: {event.workflow_id}
                          </Link>
                        </div>
                        <div className="text-xs text-muted-foreground">#{event.id}</div>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {formatDate(event.created_at)} ({formatRelativeTime(event.created_at)})
                      </div>
                      {event.payload && Object.keys(event.payload).length > 0 && (
                        <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                          {JSON.stringify(event.payload, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

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
              <p className="text-muted-foreground">No events found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
