
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { BedDouble, Users, FileText, AlertCircle, Building2, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';

const Dashboard = () => {
  useEffect(() => {
    document.title = 'Dashboard | Hostel Management System';
  }, []);

  // Fetch students count
  const { data: studentsCount = 0 } = useQuery({
    queryKey: ['studentsCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch rooms data
  const { data: roomsData } = useQuery({
    queryKey: ['roomsData'],
    queryFn: async () => {
      const { data: rooms, error } = await supabase
        .from('rooms')
        .select('*');
      
      if (error) throw error;
      
      const totalRooms = rooms.length;
      const availableRooms = rooms.filter(room => room.status === 'Available').length;
      
      return { totalRooms, availableRooms };
    },
    initialData: { totalRooms: 0, availableRooms: 0 }
  });

  // Fetch pending leave requests count
  const { data: pendingLeaveRequests = 0 } = useQuery({
    queryKey: ['pendingLeaveRequests'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('leave_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pending');
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch pending complaints count
  const { data: pendingComplaints = 0 } = useQuery({
    queryKey: ['pendingComplaints'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('complaints')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pending');
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch due fee records count
  const { data: dueFees = 0 } = useQuery({
    queryKey: ['dueFees'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('fee_records')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Due');
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch recent students
  const { data: recentStudents = [] } = useQuery({
    queryKey: ['recentStudents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch recent inquiries with adapter
  const { data: recentInquiries = [] } = useQuery({
    queryKey: ['recentInquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('submission_date', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data.map(inquiry => ({
        id: inquiry.id,
        name: inquiry.name,
        subject: inquiry.subject,
        submissionDate: inquiry.submission_date,
        status: inquiry.status as 'Read' | 'Unread'
      }));
    }
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
        <DashboardCard
          title="Total Students"
          value={studentsCount}
          icon={Users}
          description="Registered in hostel"
        />
        <DashboardCard
          title="Total Rooms"
          value={roomsData.totalRooms}
          icon={BedDouble}
          description={`${roomsData.availableRooms} rooms available`}
        />
        <DashboardCard
          title="Leave Requests"
          value={pendingLeaveRequests}
          icon={FileText}
          description="Pending approval"
        />
        <DashboardCard
          title="Complaints"
          value={pendingComplaints}
          icon={AlertCircle}
          description="Requires attention"
        />
        <DashboardCard
          title="Pending Fees"
          value={dueFees}
          icon={CreditCard}
          description="Due payments"
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-lg p-6 bg-card text-card-foreground">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="mr-2 h-5 w-5" /> Recent Students
          </h2>
          <div className="space-y-4">
            {recentStudents.length === 0 ? (
              <p className="text-muted-foreground">No students registered yet.</p>
            ) : (
              recentStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">Roll No: {student.roll_no}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Room {student.room_no}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="border rounded-lg p-6 bg-card text-card-foreground">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Building2 className="mr-2 h-5 w-5" /> Recent Inquiries
          </h2>
          <div className="space-y-4">
            {recentInquiries.length === 0 ? (
              <p className="text-muted-foreground">No inquiries received yet.</p>
            ) : (
              recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{inquiry.name}</p>
                    <p className="text-sm text-muted-foreground">{inquiry.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{format(parseISO(inquiry.submissionDate), 'yyyy-MM-dd')}</p>
                    <StatusBadge status={inquiry.status} className="ml-2 px-1.5 py-0.5 text-xs rounded" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status, className }: { status: string, className?: string }) => {
  const getStatusClass = () => {
    switch (status) {
      case 'Read':
        return 'bg-blue-100 text-blue-800';
      case 'Unread':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center ${getStatusClass()} ${className || ''}`}>
      {status}
    </span>
  );
};

export default Dashboard;
