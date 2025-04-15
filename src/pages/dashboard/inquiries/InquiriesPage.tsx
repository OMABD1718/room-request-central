
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Inquiry } from '@/types';
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
import InquiryViewDialog from './InquiryViewDialog';

const fetchInquiries = async () => {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('submission_date', { ascending: false });

  if (error) throw error;
  return data;
};

const InquiriesPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: inquiries = [], isLoading, error, refetch } = useQuery({
    queryKey: ['inquiries'],
    queryFn: fetchInquiries,
  });

  useEffect(() => {
    document.title = 'Inquiries | Hostel Management System';
  }, []);

  const handleViewInquiry = async (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsDialogOpen(true);
    
    // If inquiry is unread, mark it as read
    if (inquiry.status === 'Unread') {
      await markInquiryAsRead(inquiry.id);
    }
  };

  const markInquiryAsRead = async (id: string) => {
    const { error } = await supabase
      .from('inquiries')
      .update({ status: 'Read' })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      refetch();
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => 
    inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Inquiries Management</h1>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search inquiries..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-8"
          />
        </div>
      </div>
      
      {error ? (
        <div className="bg-destructive/10 p-4 rounded-md text-destructive">
          Error loading inquiries: {(error as Error).message}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableCaption>A list of all inquiries</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Received On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    Loading inquiries...
                  </TableCell>
                </TableRow>
              ) : filteredInquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    {searchTerm ? 'No inquiries found matching your search.' : 'No inquiries have been submitted yet.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <TableRow key={inquiry.id} className={inquiry.status === 'Unread' ? 'bg-muted/30' : ''}>
                    <TableCell className="font-medium">{inquiry.name}</TableCell>
                    <TableCell>{inquiry.email}</TableCell>
                    <TableCell>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-left"
                        onClick={() => handleViewInquiry(inquiry)}
                      >
                        <div className="max-w-[200px] truncate" title={inquiry.subject}>
                          {inquiry.subject}
                        </div>
                      </Button>
                    </TableCell>
                    <TableCell>{format(parseISO(inquiry.submissionDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <StatusBadge status={inquiry.status} className="px-2 py-0.5 rounded text-xs font-medium" />
                    </TableCell>
                    <TableCell className="text-right">
                      {inquiry.status === 'Unread' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => markInquiryAsRead(inquiry.id)}
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

      <InquiryViewDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        inquiry={selectedInquiry}
      />
    </div>
  );
};

export default InquiriesPage;
