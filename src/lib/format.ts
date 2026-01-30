import { formatDistanceToNow, format, parseISO } from "date-fns";

const parseDate = (date: string | Date): Date => {
  if (typeof date === "string") {
    // If the date is in UTC format without 'Z', append it
    const dateStr = date.endsWith("Z") ? date : `${date}Z`;
    return parseISO(dateStr);
  }
  return date;
};

export const formatDate = (date: string | Date) => {
  const dateObj = parseDate(date);
  return format(dateObj, "MMM dd, yyyy HH:mm:ss");
};

export const formatRelativeTime = (date: string | Date) => {
  const dateObj = parseDate(date);
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const formatDuration = (seconds: number) => {
  if (seconds < 60) {
    return `${seconds.toFixed(2)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) {
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};
