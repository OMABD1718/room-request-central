
import { useEffect, useState } from 'react';
import { useStudentAuth } from '@/contexts/StudentAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type LeaveRequest = {
  id: string;
  student_name: string;
  roll_no: string;
  room_no: string;
  reason: string;
  start_date: string;
  end_date: string;
  submission_date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const StudentLeaveRequests = () => {
  const { student } = useStudentAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      if (!student) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('leave_requests')
          .select('*')
          .eq('student_id', student.id)
          .order('submission_date', { ascending: false });
        
        if (error) throw error;
        
        setLeaveRequests(data as LeaveRequest[]);
      } catch (err) {
        console.error('Error fetching leave requests:', err);
        setError('Failed to load your leave requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, [student]);

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading your leave requests...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (leaveRequests.length === 0) {
    return (
      <div className="text-center py-6 border rounded-md bg-muted/30">
        <p className="text-muted-foreground">You haven't submitted any leave requests yet.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableCaption>Your leave request history</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Dates</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Submitted On</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaveRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                {format(new Date(request.start_date), 'MMM d, yyyy')} - {format(new Date(request.end_date), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>{request.reason}</TableCell>
              <TableCell>{format(new Date(request.submission_date), 'MMM d, yyyy')}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(request.status)}`}>
                  {request.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentLeaveRequests;
