
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Inquiry } from '@/types';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { format, parseISO } from 'date-fns';

interface InquiryViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inquiry: Inquiry | null;
}

const InquiryViewDialog = ({ 
  open, 
  onOpenChange, 
  inquiry 
}: InquiryViewDialogProps) => {
  if (!inquiry) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inquiry Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p>{inquiry.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="break-all">{inquiry.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Received On</p>
              <p>{format(parseISO(inquiry.submissionDate), 'MMMM dd, yyyy HH:mm')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <StatusBadge status={inquiry.status} className="px-2 py-0.5 rounded text-xs font-medium" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Subject</p>
            <p className="font-medium">{inquiry.subject}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Message</p>
            <div className="p-4 rounded-md bg-muted/50">
              <p className="whitespace-pre-wrap">{inquiry.message}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InquiryViewDialog;
