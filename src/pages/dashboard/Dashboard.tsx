
import { useEffect } from 'react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { BedDouble, Users, FileText, AlertCircle, Building2 } from 'lucide-react';
import { mockStudents, mockRooms, mockLeaveRequests, mockComplaints } from '@/data/mockData';

const Dashboard = () => {
  useEffect(() => {
    document.title = 'Dashboard | Hostel Management System';
  }, []);

  const totalStudents = mockStudents.length;
  const totalRooms = mockRooms.length;
  const availableRooms = mockRooms.filter(room => room.status === 'Available').length;
  const pendingLeaveRequests = mockLeaveRequests.filter(req => req.status === 'Pending').length;
  const pendingComplaints = mockComplaints.filter(complaint => complaint.status === 'Pending').length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
        <DashboardCard
          title="Total Students"
          value={totalStudents}
          icon={Users}
          description="Registered in hostel"
        />
        <DashboardCard
          title="Total Rooms"
          value={totalRooms}
          icon={BedDouble}
          description={`${availableRooms} rooms available`}
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
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="dashboard-card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="mr-2 h-5 w-5" /> Recent Students
          </h2>
          <div className="space-y-4">
            {mockStudents.slice(0, 5).map((student) => (
              <div key={student.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">Roll No: {student.rollNo}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Room {student.roomNo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="dashboard-card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Building2 className="mr-2 h-5 w-5" /> Recent Inquiries
          </h2>
          <div className="space-y-4">
            {/* We would display recent inquiries here */}
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">David Miller</p>
                <p className="text-sm text-muted-foreground">Accommodation Inquiry</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">2025-04-10</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">Sarah Johnson</p>
                <p className="text-sm text-muted-foreground">Fee Structure</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">2025-04-13</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">Thomas Lee</p>
                <p className="text-sm text-muted-foreground">Hostel Facilities</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">2025-04-15</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
