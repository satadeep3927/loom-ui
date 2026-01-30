import { z } from "zod";

// Enums
export enum WorkflowStatus {
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELED = "CANCELED",
}

export enum TaskStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum TaskKind {
  STEP = "STEP",
  ACTIVITY = "ACTIVITY",
  TIMER = "TIMER",
}

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
}

export enum EventType {
  WORKFLOW_STARTED = "WORKFLOW_STARTED",
  WORKFLOW_COMPLETED = "WORKFLOW_COMPLETED",
  WORKFLOW_FAILED = "WORKFLOW_FAILED",
  STEP_START = "STEP_START",
  STEP_COMPLETE = "STEP_COMPLETE",
  STEP_FAILED = "STEP_FAILED",
  STATE_SET = "STATE_SET",
  TIMER_STARTED = "TIMER_STARTED",
  TIMER_FIRED = "TIMER_FIRED",
}

// Zod Schemas
export const workflowSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string().optional(),
  status: z.enum(WorkflowStatus),
  created_at: z.string(),
  updated_at: z.string().optional(),
  completed_at: z.string().optional(),
  event_count: z.number().optional(),
});

export const workflowDetailSchema = workflowSummarySchema.extend({
  module: z.string().optional(),
  input: z.record(z.string(), z.any()).optional(),
  current_state: z.record(z.string(), z.any()).optional(),
  error_message: z.string().optional(),
  duration: z.number().optional(),
});

export const taskSummarySchema = z.object({
  id: z.string(),
  workflow_id: z.string(),
  workflow_name: z.string().optional(),
  kind: z.nativeEnum(TaskKind),
  target: z.string(),
  status: z.nativeEnum(TaskStatus),
  attempts: z.number(),
  max_attempts: z.number().optional(),
  run_at: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
  last_error: z.string().nullable().optional(),
});

export const taskDetailSchema = taskSummarySchema.extend({
  input: z.record(z.string(), z.any()).optional(),
  result: z.any().optional(),
  max_attempts: z.number().optional(),
  timeout_seconds: z.number().optional(),
});

export const eventSummarySchema = z.object({
  id: z.number(),
  workflow_id: z.string(),
  type: z.enum(EventType),
  created_at: z.string(),
});

export const eventDetailSchema = eventSummarySchema.extend({
  payload: z.record(z.string(), z.any()),
});

export const logEntrySchema = z.object({
  id: z.number(),
  workflow_id: z.string(),
  level: z.nativeEnum(LogLevel),
  message: z.string(),
  created_at: z.string(),
  extra: z.record(z.string(), z.any()).optional(),
});

export const paginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  per_page: z.number(),
  pages: z.number(),
  has_next: z.boolean(),
  has_prev: z.boolean(),
});

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T,
) =>
  z.object({
    data: z.array(itemSchema),
    meta: paginationMetaSchema,
  });

export const workflowStatsSchema = z.object({
  total: z.number(),
  running: z.number(),
  completed: z.number(),
  failed: z.number(),
  canceled: z.number(),
});

export const taskStatsSchema = z.object({
  total: z.number(),
  pending: z.number(),
  running: z.number(),
  completed: z.number(),
  failed: z.number(),
});

export const systemStatsSchema = z.object({
  workflows: workflowStatsSchema,
  tasks: taskStatsSchema,
  events: z.number(),
  logs: z.number(),
});

export const graphNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  label: z.string(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const graphEdgeSchema = z.object({
  from: z.string(),
  to: z.string(),
  type: z.string(),
  label: z.string().optional(),
});

export const workflowDiagramSchema = z.object({
  nodes: z.array(graphNodeSchema),
  edges: z.array(graphEdgeSchema),
  metadata: z
    .object({
      workflow_name: z.string(),
      workflow_version: z.string().optional(),
      workflow_description: z.string().optional(),
    })
    .optional(),
});

// TypeScript Types
export type WorkflowSummary = z.infer<typeof workflowSummarySchema>;
export type WorkflowDetail = z.infer<typeof workflowDetailSchema>;
export type TaskSummary = z.infer<typeof taskSummarySchema>;
export type TaskDetail = z.infer<typeof taskDetailSchema>;
export type EventSummary = z.infer<typeof eventSummarySchema>;
export type EventDetail = z.infer<typeof eventDetailSchema>;
export type LogEntry = z.infer<typeof logEntrySchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};
export type WorkflowStats = z.infer<typeof workflowStatsSchema>;
export type TaskStats = z.infer<typeof taskStatsSchema>;
export type SystemStats = z.infer<typeof systemStatsSchema>;
export type GraphNode = z.infer<typeof graphNodeSchema>;
export type GraphEdge = z.infer<typeof graphEdgeSchema>;
export type WorkflowDiagram = z.infer<typeof workflowDiagramSchema>;
