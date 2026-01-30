import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  workflowsApi,
  tasksApi,
  eventsApi,
  logsApi,
  statsApi,
  type WorkflowListParams,
  type TaskListParams,
  type EventListParams,
  type LogListParams,
  type PaginationParams,
} from './api';
import type {
  WorkflowSummary,
  WorkflowDetail,
  TaskSummary,
  TaskDetail,
  EventDetail,
  LogEntry,
  PaginatedResponse,
  SystemStats,
  WorkflowDiagram,
} from './types';

// Query Keys
export const queryKeys = {
  workflows: {
    all: ['workflows'] as const,
    lists: () => [...queryKeys.workflows.all, 'list'] as const,
    list: (params?: WorkflowListParams) => [...queryKeys.workflows.lists(), params] as const,
    details: () => [...queryKeys.workflows.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.workflows.details(), id] as const,
    events: (id: string, params?: EventListParams) =>
      [...queryKeys.workflows.detail(id), 'events', params] as const,
    logs: (id: string, params?: LogListParams) =>
      [...queryKeys.workflows.detail(id), 'logs', params] as const,
    diagram: (id: string) => [...queryKeys.workflows.detail(id), 'diagram'] as const,
  },
  tasks: {
    all: ['tasks'] as const,
    lists: () => [...queryKeys.tasks.all, 'list'] as const,
    list: (params?: TaskListParams) => [...queryKeys.tasks.lists(), params] as const,
    details: () => [...queryKeys.tasks.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.tasks.details(), id] as const,
    pending: (params?: PaginationParams) =>
      [...queryKeys.tasks.all, 'pending', params] as const,
  },
  events: {
    all: ['events'] as const,
    lists: () => [...queryKeys.events.all, 'list'] as const,
    list: (params?: EventListParams) => [...queryKeys.events.lists(), params] as const,
    details: () => [...queryKeys.events.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.events.details(), id] as const,
  },
  logs: {
    all: ['logs'] as const,
    lists: () => [...queryKeys.logs.all, 'list'] as const,
    list: (params?: LogListParams) => [...queryKeys.logs.lists(), params] as const,
    errors: (params?: LogListParams) => [...queryKeys.logs.all, 'errors', params] as const,
    recent: (params?: PaginationParams) => [...queryKeys.logs.all, 'recent', params] as const,
  },
  stats: {
    all: ['stats'] as const,
    system: () => [...queryKeys.stats.all, 'system'] as const,
  },
};

// Workflows
export const useWorkflows = (
  params?: WorkflowListParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<WorkflowSummary>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.workflows.list(params),
    queryFn: () => workflowsApi.list(params),
    ...options,
  });
};

export const useWorkflow = (
  workflowId: string,
  options?: Omit<UseQueryOptions<WorkflowDetail>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.workflows.detail(workflowId),
    queryFn: () => workflowsApi.get(workflowId),
    enabled: !!workflowId,
    ...options,
  });
};

export const useWorkflowEvents = (
  workflowId: string,
  params?: EventListParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<EventDetail>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.workflows.events(workflowId, params),
    queryFn: () => workflowsApi.getEvents(workflowId, params),
    enabled: !!workflowId,
    ...options,
  });
};

export const useWorkflowLogs = (
  workflowId: string,
  params?: LogListParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<LogEntry>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.workflows.logs(workflowId, params),
    queryFn: () => workflowsApi.getLogs(workflowId, params),
    enabled: !!workflowId,
    ...options,
  });
};

export const useWorkflowDiagram = (
  workflowId: string,
  options?: Omit<UseQueryOptions<WorkflowDiagram>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.workflows.diagram(workflowId),
    queryFn: () => workflowsApi.getDiagram(workflowId),
    enabled: !!workflowId,
    ...options,
  });
};

// Tasks
export const useTasks = (
  params?: TaskListParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<TaskSummary>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.tasks.list(params),
    queryFn: () => tasksApi.list(params),
    ...options,
  });
};

export const useTask = (
  taskId: string,
  options?: Omit<UseQueryOptions<TaskDetail>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.tasks.detail(taskId),
    queryFn: () => tasksApi.get(taskId),
    enabled: !!taskId,
    ...options,
  });
};

export const usePendingTasks = (
  params?: PaginationParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<TaskSummary>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.tasks.pending(params),
    queryFn: () => tasksApi.listPending(params),
    ...options,
  });
};

// Events
export const useEvents = (
  params?: EventListParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<EventDetail>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.events.list(params),
    queryFn: () => eventsApi.list(params),
    ...options,
  });
};

// Logs
export const useLogs = (
  params?: LogListParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<LogEntry>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.logs.list(params),
    queryFn: () => logsApi.list(params),
    ...options,
  });
};

export const useErrorLogs = (
  params?: LogListParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<LogEntry>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.logs.errors(params),
    queryFn: () => logsApi.listErrors(params),
    ...options,
  });
};

export const useRecentLogs = (
  params?: PaginationParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<LogEntry>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.logs.recent(params),
    queryFn: () => logsApi.listRecent(params),
    ...options,
  });
};

// Statistics
export const useSystemStats = (
  options?: Omit<UseQueryOptions<SystemStats>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.stats.system(),
    queryFn: () => statsApi.getSystem(),
    refetchInterval: 5000, // Auto-refresh every 5 seconds
    ...options,
  });
};
