import { apiClient } from './api-client';
import type {
  WorkflowSummary,
  WorkflowDetail,
  TaskSummary,
  TaskDetail,
  EventDetail,
  LogEntry,
  PaginatedResponse,
  SystemStats,
  WorkflowStats,
  TaskStats,
  WorkflowStatus,
  TaskStatus,
  LogLevel,
  EventType,
} from './types';

// Query Parameters
export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface SortParams {
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface WorkflowListParams extends PaginationParams, SortParams {
  status?: WorkflowStatus;
  name?: string;
}

export interface TaskListParams extends PaginationParams, SortParams {
  workflow_id?: string;
  status?: TaskStatus;
  kind?: string;
}

export interface EventListParams extends PaginationParams, SortParams {
  workflow_id?: string;
  type?: EventType;
  since?: string;
}

export interface LogListParams extends PaginationParams, SortParams {
  workflow_id?: string;
  level?: LogLevel;
  since?: string;
}

// Workflows
export const workflowsApi = {
  list: async (params?: WorkflowListParams) => {
    const { data } = await apiClient.get<PaginatedResponse<WorkflowSummary>>('/api/workflows/', {
      params,
    });
    return data;
  },

  get: async (workflowId: string) => {
    const { data } = await apiClient.get<WorkflowDetail>(`/api/workflows/${workflowId}`);
    return data;
  },

  getEvents: async (workflowId: string, params?: EventListParams) => {
    const { data } = await apiClient.get<PaginatedResponse<EventDetail>>(
      `/api/workflows/${workflowId}/events`,
      { params }
    );
    return data;
  },

  getLogs: async (workflowId: string, params?: LogListParams) => {
    const { data } = await apiClient.get<PaginatedResponse<LogEntry>>(
      `/api/workflows/${workflowId}/logs`,
      { params }
    );
    return data;
  },

  getDiagram: async (workflowId: string) => {
    const { data } = await apiClient.get(`/api/graphs/workflow/${workflowId}/definition/render`);
    return data;
  },
};

// Tasks
export const tasksApi = {
  list: async (params?: TaskListParams) => {
    const { data } = await apiClient.get<PaginatedResponse<TaskSummary>>('/api/tasks/', {
      params,
    });
    return data;
  },

  get: async (taskId: string) => {
    const { data } = await apiClient.get<TaskDetail>(`/api/tasks/${taskId}`);
    return data;
  },

  listPending: async (params?: PaginationParams) => {
    const { data } = await apiClient.get<PaginatedResponse<TaskSummary>>('/api/tasks/pending', {
      params,
    });
    return data;
  },
};

// Events
export const eventsApi = {
  list: async (params?: EventListParams) => {
    const { data } = await apiClient.get<PaginatedResponse<EventDetail>>('/api/events/', {
      params,
    });
    return data;
  },

  get: async (eventId: number) => {
    const { data } = await apiClient.get<EventDetail>(`/api/events/${eventId}`);
    return data;
  },
};

// Logs
export const logsApi = {
  list: async (params?: LogListParams) => {
    const { data } = await apiClient.get<PaginatedResponse<LogEntry>>('/api/logs/', {
      params,
    });
    return data;
  },

  listErrors: async (params?: LogListParams) => {
    const { data } = await apiClient.get<PaginatedResponse<LogEntry>>('/api/logs/errors', {
      params,
    });
    return data;
  },

  listRecent: async (params?: PaginationParams) => {
    const { data } = await apiClient.get<PaginatedResponse<LogEntry>>('/api/logs/recent', {
      params,
    });
    return data;
  },
};

// Statistics
export const statsApi = {
  getSystem: async () => {
    const { data } = await apiClient.get<SystemStats>('/api/stats/');
    return data;
  },

  getWorkflows: async () => {
    const { data } = await apiClient.get<WorkflowStats>('/api/stats/workflows');
    return data;
  },

  getTasks: async () => {
    const { data } = await apiClient.get<TaskStats>('/api/stats/tasks');
    return data;
  },
};
