import { useState } from "react";
import { useLogs } from "@/lib/queries";
import { LogLevel } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogLevelBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

export function LogsPage() {
  const [page, setPage] = useState(1);
  const [level, setLevel] = useState<LogLevel | "ALL">("ALL");
  const perPage = 50;

  const { data, isLoading } = useLogs({
    page,
    per_page: perPage,
    level: level === "ALL" ? undefined : level,
    sort_by: "created_at",
    sort_order: "desc",
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logs</h1>
          <p className="text-muted-foreground">System-wide log monitoring</p>
        </div>
        <Select
          value={level}
          onValueChange={(value) => setLevel(value as LogLevel | "ALL")}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Levels</SelectItem>
            <SelectItem value={LogLevel.DEBUG}>Debug</SelectItem>
            <SelectItem value={LogLevel.INFO}>Info</SelectItem>
            <SelectItem value={LogLevel.WARNING}>Warning</SelectItem>
            <SelectItem value={LogLevel.ERROR}>Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {data?.meta.total || 0} Log Entr
            {data?.meta.total !== 1 ? "ies" : "y"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : data?.data.length ? (
            <>
              <ScrollArea className="h-150">
                <div className="space-y-2 font-mono text-xs">
                  {data.data.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <LogLevelBadge level={log.level} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Link
                              to={`/workflows/${log.workflow_id}`}
                              className="text-blue-500 hover:underline"
                            >
                              {log.workflow_id}
                            </Link>
                            <span className="text-muted-foreground">
                              {formatDate(log.created_at)}
                            </span>
                          </div>
                          <p className="text-sm wrap-break-word">
                            {log.message}
                          </p>
                          {log.extra && Object.keys(log.extra).length > 0 && (
                            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                              {JSON.stringify(log.extra, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {data.meta.pages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {data.meta.page} of {data.meta.pages} (
                    {data.meta.total} total)
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
              <p className="text-muted-foreground">No logs found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
