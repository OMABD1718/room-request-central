
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { format, parseISO } from 'date-fns';
import { Search, Plus, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import FeeRecordModal from './FeeRecordModal';

interface FeeRecord {
  id: string;
  student_id: string;
  amount: number;
  due_date: string;
  payment_date: string | null;
  status: 'Paid' | 'Due';
  created_at: string;
  updated_at: string;
  student: {
    name: string;
    roll_no: string;
    room_no: string;
  };
}

const fetchFeeRecords = async () => {
  const { data, error } = await supabase
    .from('fee_records')
    .select(`
      *,
      student:student_id (
        name,
        roll_no,
        room_no
      )
    `)
    .order('due_date', { ascending: false });

  if (error) throw error;
  return data as FeeRecord[];
};

const fetchStudents = async () => {
  const { data, error } = await supabase
    .from('students')
    .select('id, name, roll_no, room_no')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
};

const FeeTrackingPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeeRecord, setEditingFeeRecord] = useState<FeeRecord | null>(null);

  const { data: feeRecords = [], isLoading, error, refetch } = useQuery({
    queryKey: ['feeRecords'],
    queryFn: fetchFeeRecords,
  });

  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
  });

  useEffect(() => {
    document.title = 'Fee Tracking | Hostel Management System';
  }, []);

  const handleAddFeeRecord = () => {
    setEditingFeeRecord(null);
    setIsModalOpen(true);
  };

  const markAsPaid = async (id: string) => {
    const { error } = await supabase
      .from('fee_records')
      .update({ 
        status: 'Paid', 
        payment_date: new Date().toISOString() 
      })
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
        description: 'Fee record marked as paid',
      });
      refetch();
    }
  };

  const filteredFeeRecords = feeRecords.filter(record => 
    record.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    record.student?.roll_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.student?.room_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Fee Tracking</h1>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search fee records..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-8"
          />
        </div>
        <Button onClick={handleAddFeeRecord}>
          <Plus className="mr-2 h-4 w-4" /> Add Fee Record
        </Button>
      </div>
      
      {error ? (
        <div className="bg-destructive/10 p-4 rounded-md text-destructive">
          Error loading fee records: {(error as Error).message}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableCaption>A list of all fee records</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Roll No.</TableHead>
                <TableHead>Room No.</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    Loading fee records...
                  </TableCell>
                </TableRow>
              ) : filteredFeeRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    {searchTerm ? 'No fee records found matching your search.' : 'No fee records have been added yet.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredFeeRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.student?.name}</TableCell>
                    <TableCell>{record.student?.roll_no}</TableCell>
                    <TableCell>{record.student?.room_no}</TableCell>
                    <TableCell>${record.amount.toFixed(2)}</TableCell>
                    <TableCell>{format(parseISO(record.due_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      {record.payment_date 
                        ? format(parseISO(record.payment_date), 'MMM dd, yyyy')
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={record.status} className="px-2 py-0.5 rounded text-xs font-medium" />
                    </TableCell>
                    <TableCell className="text-right">
                      {record.status === 'Due' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => markAsPaid(record.id)}
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

      <FeeRecordModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        feeRecord={editingFeeRecord}
        students={students}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default FeeTrackingPage;
