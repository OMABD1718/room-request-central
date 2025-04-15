
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Complaint } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { format, parseISO } from 'date-fns';
import { Search, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ComplaintViewDialog from './ComplaintViewDialog';

// Adapter function to convert database response to our type
const adaptComplaint = (dbComplaint: any): Complaint => ({
  id: dbComplaint.id,
  studentName: dbComplaint.student_name,
  rollNo: dbComplaint.roll_no,
  roomNo: dbComplaint.room_no,
  description: dbComplaint.description,
  submissionDate: dbComplaint.submission_date,
  status: dbComplaint.status as 'Resolved' | 'Pending'
});

const fetchComplaints = async () => {
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .order('submission_date', { ascending: false });

  if (error) throw error;
  return data.map(adaptComplaint);
};

const ComplaintsPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: complaints = [], isLoading, error, refetch } = useQuery({
    queryKey: ['complaints'],
    queryFn: fetchComplaints,
  });

  useEffect(() => {
    document.title = 'Complaints | Hostel Management System';
  }, []);

  const handleViewComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDialogOpen(true);
  };

  const resolveComplaint = async (id: string) => {
    const { error } = await supabase
      .from('complaints')
      .update({ status: 'Resolved' })
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
        description: 'Complaint marked as resolved',
      });
      refetch();
    }
  };

  const filteredComplaints = complaints.filter(complaint => 
    complaint.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    complaint.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.roomNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Complaints Management</h1>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search complaints..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-8"
          />
        </div>
      </div>
      
      {error ? (
        <div className="bg-destructive/10 p-4 rounded-md text-destructive">
          Error loading complaints: {(error as Error).message}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableCaption>A list of all complaints</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Roll No.</TableHead>
                <TableHead>Room No.</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Submitted On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    Loading complaints...
                  </TableCell>
                </TableRow>
              ) : filteredComplaints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    {searchTerm ? 'No complaints found matching your search.' : 'No complaints have been submitted yet.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredComplaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-medium">{complaint.studentName}</TableCell>
                    <TableCell>{complaint.rollNo}</TableCell>
                    <TableCell>{complaint.roomNo}</TableCell>
                    <TableCell>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-left"
                        onClick={() => handleViewComplaint(complaint)}
                      >
                        <div className="max-w-[200px] truncate" title={complaint.description}>
                          {complaint.description}
                        </div>
                      </Button>
                    </TableCell>
                    <TableCell>{format(parseISO(complaint.submissionDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <StatusBadge status={complaint.status} className="px-2 py-0.5 rounded text-xs font-medium" />
                    </TableCell>
                    <TableCell className="text-right">
                      {complaint.status === 'Pending' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => resolveComplaint(complaint.id)}
                          className="text-green-500"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <ComplaintViewDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        complaint={selectedComplaint}
        onResolve={() => {
          if (selectedComplaint) {
            resolveComplaint(selectedComplaint.id);
          }
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
};

export default ComplaintsPage;
