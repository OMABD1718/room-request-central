
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LeaveRequest } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { format, parseISO } from 'date-fns';
import { Search, CheckCircle, XCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Adapter function to convert database response to our type
const adaptLeaveRequest = (dbLeaveRequest: any): LeaveRequest => ({
  id: dbLeaveRequest.id,
  studentName: dbLeaveRequest.student_name,
  rollNo: dbLeaveRequest.roll_no,
  roomNo: dbLeaveRequest.room_no,
  reason: dbLeaveRequest.reason,
  startDate: dbLeaveRequest.start_date,
  endDate: dbLeaveRequest.end_date,
  status: dbLeaveRequest.status as 'Approved' | 'Pending' | 'Rejected',
  submissionDate: dbLeaveRequest.submission_date
});

const fetchLeaveRequests = async () => {
  const { data, error } = await supabase
    .from('leave_requests')
    .select('*')
    .order('submission_date', { ascending: false });

  if (error) throw error;
  return data.map(adaptLeaveRequest);
};

const LeaveRequestsPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: leaveRequests = [], isLoading, error, refetch } = useQuery({
    queryKey: ['leaveRequests'],
    queryFn: fetchLeaveRequests,
  });

  useEffect(() => {
    document.title = 'Leave Requests | Hostel Management System';
  }, []);

  const updateLeaveRequestStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    const { error } = await supabase
      .from('leave_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `Leave request ${status.toLowerCase()} successfully`,
      });
      refetch();
    }
  };

  const filteredLeaveRequests = leaveRequests.filter(request => 
    request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    request.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.roomNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Leave Requests Management</h1>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search requests..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-8"
          />
        </div>
      </div>
      
      {error ? (
        <div className="bg-destructive/10 p-4 rounded-md text-destructive">
          Error loading leave requests: {(error as Error).message}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableCaption>A list of all leave requests</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Roll No.</TableHead>
                <TableHead>Room No.</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    Loading leave requests...
                  </TableCell>
                </TableRow>
              ) : filteredLeaveRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    {searchTerm ? 'No leave requests found matching your search.' : 'No leave requests have been submitted yet.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeaveRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.studentName}</TableCell>
                    <TableCell>{request.rollNo}</TableCell>
                    <TableCell>{request.roomNo}</TableCell>
                    <TableCell>{format(parseISO(request.startDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{format(parseISO(request.endDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate" title={request.reason}>
                        {request.reason}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} className="px-2 py-0.5 rounded text-xs font-medium" />
                    </TableCell>
                    <TableCell className="text-right">
                      {request.status === 'Pending' && (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateLeaveRequestStatus(request.id, 'Approved')}
                            className="text-green-500"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateLeaveRequestStatus(request.id, 'Rejected')}
                            className="text-red-500"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default LeaveRequestsPage;
