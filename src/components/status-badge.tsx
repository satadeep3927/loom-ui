import { Badge } from '@/components/ui/badge';
import { WorkflowStatus, TaskStatus, LogLevel } from '@/lib/types';

interface StatusBadgeProps {
  status: WorkflowStatus | TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getColorClass = (status: WorkflowStatus | TaskStatus) => {
    switch (status) {
      case 'RUNNING':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'COMPLETED':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'FAILED':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'CANCELED':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      case 'PENDING':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <Badge variant="outline" className={getColorClass(status)}>
      {status}
    </Badge>
  );
}

interface LogLevelBadgeProps {
  level: LogLevel;
}

export function LogLevelBadge({ level }: LogLevelBadgeProps) {
  const colors = {
    [LogLevel.DEBUG]: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    [LogLevel.INFO]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    [LogLevel.WARNING]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    [LogLevel.ERROR]: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <Badge variant="outline" className={colors[level]}>
      {level}
    </Badge>
  );
}
