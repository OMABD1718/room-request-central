
import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'Approved' | 'Rejected' | 'Pending' | 'Resolved' | 'Unread' | 'Read' | 'Paid' | 'Due' | 'Available' | 'Full' | 'Maintenance';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusClass = (status: StatusType) => {
    switch (status) {
      case 'Approved':
      case 'Resolved':
      case 'Paid':
      case 'Available':
        return 'bg-hostel-success/20 text-hostel-success';
      case 'Pending':
      case 'Unread':
      case 'Maintenance':
        return 'bg-hostel-warning/20 text-hostel-warning';
      case 'Rejected':
      case 'Due':
      case 'Full':
        return 'bg-hostel-error/20 text-hostel-error';
      case 'Read':
        return 'bg-hostel-info/20 text-hostel-info';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <span className={cn('status-badge', getStatusClass(status), className)}>
      {status}
    </span>
  );
};

export default StatusBadge;
