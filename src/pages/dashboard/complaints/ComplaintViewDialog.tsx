
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Complaint } from '@/types';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { format, parseISO } from 'date-fns';

interface ComplaintViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint: Complaint | null;
  onResolve: () => void;
}

const ComplaintViewDialog = ({ 
  open, 
  onOpenChange, 
  complaint, 
  onResolve 
}: ComplaintViewDialogProps) => {
  if (!complaint) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complaint Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Student</p>
              <p>{complaint.studentName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Roll Number</p>
              <p>{complaint.rollNo}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Room Number</p>
              <p>{complaint.roomNo}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Submitted On</p>
              <p>{format(parseISO(complaint.submissionDate), 'MMMM dd, yyyy HH:mm')}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <StatusBadge status={complaint.status} className="px-2 py-0.5 rounded text-xs font-medium" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Description</p>
            <div className="p-4 rounded-md bg-muted/50">
              <p className="whitespace-pre-wrap">{complaint.description}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {complaint.status === 'Pending' && (
              <Button onClick={onResolve}>
                Mark as Resolved
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComplaintViewDialog;
