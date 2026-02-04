import { LogLevelBadge, StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatDuration, formatRelativeTime } from "@/lib/format";
import {
  useWorkflow,
  useWorkflowDiagram,
  useWorkflowEvents,
  useWorkflowLogs,
} from "@/lib/queries";
import type { WorkflowDiagram } from "@/lib/types";
import {
  Background,
  Edge,
  MarkerType,
  Node,
  Position,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { ChevronLeft } from "lucide-react";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

export function WorkflowDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: workflow, isLoading } = useWorkflow(id!);
  const { data: events } = useWorkflowEvents(id!, { per_page: 50 });
  const { data: logs } = useWorkflowLogs(id!, { per_page: 50 });
  const { data: diagram, isLoading: diagramLoading } = useWorkflowDiagram(id!);

  if (isLoading) {
    return <WorkflowDetailSkeleton />;
  }

  if (!workflow) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Workflow not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/workflows">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{workflow.name}</h1>
          <p className="text-muted-foreground">Workflow ID: {workflow.id}</p>
        </div>
        <StatusBadge status={workflow.status} />
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflow.status}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {workflow.completed_at ? "Completed" : "In Progress"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflow.duration ? formatDuration(workflow.duration) : "-"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Execution time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflow.event_count || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Version</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflow.version || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Workflow version
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Created At</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(workflow.created_at)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatRelativeTime(workflow.created_at)}
              </p>
            </div>
            {workflow.updated_at && (
              <div>
                <p className="text-sm font-medium">Updated At</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(workflow.updated_at)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatRelativeTime(workflow.updated_at)}
                </p>
              </div>
            )}
            {workflow.completed_at && (
              <div>
                <p className="text-sm font-medium">Completed At</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(workflow.completed_at)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatRelativeTime(workflow.completed_at)}
                </p>
              </div>
            )}
            {workflow.module && (
              <div>
                <p className="text-sm font-medium">Module</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {workflow.module}
                </p>
              </div>
            )}
          </div>

          {workflow.error_message && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm font-medium text-destructive">
                Error Message
              </p>
              <p className="text-sm text-destructive/90 mt-1">
                {workflow.error_message}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for Events, Logs, and State */}
      <Tabs defaultValue="diagram" className="space-y-4">
        <TabsList>
          <TabsTrigger value="diagram">Diagram</TabsTrigger>
          <TabsTrigger value="events">
            Events ({events?.data.length || 0})
          </TabsTrigger>
          <TabsTrigger value="logs">
            Logs ({logs?.data.length || 0})
          </TabsTrigger>
          <TabsTrigger value="input">Input Data</TabsTrigger>
          {workflow.current_state && (
            <TabsTrigger value="state">Current State</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="diagram" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Diagram</CardTitle>
            </CardHeader>
            <CardContent>
              {diagramLoading ? (
                <Skeleton className="h-96 w-full" />
              ) : diagram ? (
                <ReactFlowDiagram diagram={diagram} />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No diagram available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Events Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-100">
                {events?.data.length ? (
                  <div className="space-y-2">
                    {events.data.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Badge variant="outline" className="text-xs">
                              {event.type}
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatDate(event.created_at)}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            #{event.id}
                          </div>
                        </div>
                        {event.payload &&
                          Object.keys(event.payload).length > 0 && (
                            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                              {JSON.stringify(event.payload, null, 2)}
                            </pre>
                          )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No events found
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-100">
                {logs?.data.length ? (
                  <div className="space-y-2">
                    {logs.data.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <LogLevelBadge level={log.level} />
                          <div className="flex-1">
                            <p className="text-sm">{log.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(log.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No logs found
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="input" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Input Data</CardTitle>
            </CardHeader>
            <CardContent>
              {workflow.input ? (
                <pre className="text-sm bg-muted p-4 rounded overflow-x-auto">
                  {JSON.stringify(workflow.input, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No input data available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {workflow.current_state && (
          <TabsContent value="state" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current State</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-muted p-4 rounded overflow-x-auto">
                  {JSON.stringify(workflow.current_state, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

// Node type colors
const nodeColors = {
  step: "#3b82f6", // blue
  activity: "#22c55e", // green
  timer: "#eab308", // yellow
  state: "#ef4444", // red
};

// Edge type styles
const edgeTypes = {
  sequence: { stroke: "#6b7280", strokeWidth: 2 },
  calls: { stroke: "#22c55e", strokeWidth: 2 },
  reads: { stroke: "#ef4444", strokeWidth: 1.5, strokeDasharray: "5,5" },
  writes: { stroke: "#ef4444", strokeWidth: 2 },
  waits: { stroke: "#eab308", strokeWidth: 2 },
};

function ReactFlowDiagram({ diagram }: { diagram: WorkflowDiagram }) {
  // Format label for better readability
  const formatLabel = (label: string, nodeType: string) => {
    if (nodeType === "activity") {
      // For activities: replace _ with space and capitalize
      return label
        .replace(/_/g, " ")
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
    } else if (nodeType === "state") {
      // For state: remove "state." prefix, replace _ with space, and capitalize
      const cleanLabel = label.replace(/^state\./, "");
      return cleanLabel
        .replace(/_/g, " ")
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
    } else if (nodeType === "step") {
      // For steps: replace _ with space and capitalize
      return label
        .replace(/_/g, " ")
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
    }
    return label;
  };

  // Convert API nodes to React Flow nodes with proper layout
  const { nodes, edges } = useMemo(() => {
    // Create a new directed graph for layout
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    // Configure layout direction (left to right for workflows)
    dagreGraph.setGraph({
      rankdir: "LR",
      ranksep: 150,
      nodesep: 100,
      edgesep: 50,
    });

    // First pass: create nodes with proper sizing
    const reactFlowNodes: Node[] = diagram.nodes.map((node) => {
      // Calculate appropriate node size based on content
      const labelLength = node.label.length;
      const hasDescription = !!node.metadata?.description;

      let width: number;
      let height: number;

      if (node.type === "activity") {
        // For activity nodes, make them rectangles to fit text
        width = Math.max(140, Math.min(labelLength * 7, 200));
        height = 60;
      } else if (node.type === "timer") {
        width = 100;
        height = 100;
      } else if (node.type === "state") {
        width = Math.max(120, Math.min(labelLength * 7, 180));
        height = 60;
      } else {
        // Steps
        width = Math.max(160, Math.min(labelLength * 8, 240));
        height = hasDescription ? 90 : 70;
      }

      // Add node to dagre graph for layout calculation
      dagreGraph.setNode(node.id, { width, height });

      return {
        id: node.id,
        type: "default",
        position: { x: 0, y: 0 }, // Will be set by dagre
        data: {
          label: (
            <div
              className="text-center px-2"
              style={{
                maxWidth: `${width - 40}px`,
                wordWrap: "break-word",
                overflowWrap: "break-word",
                hyphens: "auto",
              }}
            >
              <div className="font-semibold text-xs leading-tight">
                {formatLabel(node.label, node.type)}
              </div>
              {node.metadata?.description && (
                <div className="text-[10px] text-muted-foreground mt-1 leading-tight line-clamp-2">
                  {node.metadata.description}
                </div>
              )}
            </div>
          ),
        },
        style: {
          background:
            nodeColors[node.type as keyof typeof nodeColors] || "#6b7280",
          color: "white",
          border: "2px solid rgba(255, 255, 255, 0.3)",
          borderRadius:
            node.type === "activity"
              ? "6px"
              : node.type === "timer"
                ? "4px"
                : node.type === "state"
                  ? "8px"
                  : "6px",
          padding: node.type === "activity" ? "12px" : "12px",
          width: `${width}px`,
          height: `${height}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };
    });

    // Add edges to dagre graph
    diagram.edges.forEach((edge) => {
      dagreGraph.setEdge(edge.from, edge.to);
    });

    // Run layout algorithm
    dagre.layout(dagreGraph);

    // Update node positions from dagre layout
    reactFlowNodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.position = {
        x: nodeWithPosition.x - nodeWithPosition.width / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2,
      };
    });

    // Create edges with proper styling
    const reactFlowEdges: Edge[] = diagram.edges.map((edge, index) => {
      const edgeStyle = edgeTypes[edge.type as keyof typeof edgeTypes] || {
        stroke: "#6b7280",
        strokeWidth: 1,
      };

      return {
        id: `edge-${index}`,
        source: edge.from,
        target: edge.to,
        label: edge.label,
        type: "smoothstep",
        animated: edge.type === "sequence",
        style: edgeStyle,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeStyle.stroke,
        },
        labelStyle: {
          fill: "#e5e7eb",
          fontSize: 10,
        },
        labelBgStyle: {
          fill: "#0a0a0a",
          fillOpacity: 0.8,
        },
      };
    });

    return { nodes: reactFlowNodes, edges: reactFlowEdges };
  }, [diagram]);

  return (
    <div className="space-y-4">
      {diagram.metadata && (
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Nodes: {diagram.nodes.length}</span>
          <span>Edges: {diagram.edges.length}</span>
          {diagram.metadata.workflow_version && (
            <span>Version: {diagram.metadata.workflow_version}</span>
          )}
          {diagram.metadata.workflow_description && (
            <span>{diagram.metadata.workflow_description}</span>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-4 text-xs items-center flex-wrap">
        <span className="font-medium">Legend:</span>
        <div className="flex items-center gap-1.5">
          <div
            className="w-4 h-4 rounded"
            style={{ background: nodeColors.step }}
          />
          <span>Step</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-4 h-4 rounded"
            style={{ background: nodeColors.activity }}
          />
          <span>Activity</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4" style={{ background: nodeColors.timer }} />
          <span>Timer</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-4 h-4 rounded"
            style={{ background: nodeColors.state }}
          />
          <span>State</span>
        </div>
      </div>

      <div className="h-[600px] w-full border rounded-lg bg-background">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          attributionPosition="bottom-left"
          minZoom={0.1}
          maxZoom={2}
          defaultEdgeOptions={{
            type: "smoothstep",
          }}
        >
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}

function WorkflowDetailSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-10 w-64" />
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
