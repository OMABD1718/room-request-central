
import { useEffect, useState } from 'react';
import { useStudentAuth } from '@/contexts/StudentAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Complaint = {
  id: string;
  student_name: string;
  roll_no: string;
  room_no: string;
  description: string;
  submission_date: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
}

const StudentComplaints = () => {
  const { student } = useStudentAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!student) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('complaints')
          .select('*')
          .eq('student_id', student.id)
          .order('submission_date', { ascending: false });
        
        if (error) throw error;
        
        setComplaints(data as Complaint[]);
      } catch (err) {
        console.error('Error fetching complaints:', err);
        setError('Failed to load your complaints. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [student]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading your complaints...</div>;
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

  if (complaints.length === 0) {
    return (
      <div className="text-center py-6 border rounded-md bg-muted/30">
        <p className="text-muted-foreground">You haven't submitted any complaints yet.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableCaption>Your complaint history</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Submitted On</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.map((complaint) => (
            <TableRow key={complaint.id}>
              <TableCell>{complaint.description}</TableCell>
              <TableCell>{format(new Date(complaint.submission_date), 'MMM d, yyyy')}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                  {complaint.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentComplaints;
