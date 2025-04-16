
import { useEffect } from 'react';
import { useStudentAuth } from '@/contexts/StudentAuthContext';
import StudentLeaveRequests from '@/components/student/StudentLeaveRequests';
import StudentComplaints from '@/components/student/StudentComplaints';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle } from 'lucide-react';

const StudentDashboard = () => {
  const { student } = useStudentAuth();
  
  useEffect(() => {
    document.title = 'Student Dashboard | Hostel Management System';
  }, []);

  if (!student) {
    return <Navigate to="/student-login" replace />;
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Welcome, {student.name}</CardTitle>
          <CardDescription>
            Room: {student.roomNo} | Roll Number: {student.rollNo}
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="leave-requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leave-requests" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Leave Requests</span>
          </TabsTrigger>
          <TabsTrigger value="complaints" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Complaints</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="leave-requests" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Leave Requests</h2>
          </div>
          <StudentLeaveRequests />
        </TabsContent>
        <TabsContent value="complaints" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Complaints</h2>
          </div>
          <StudentComplaints />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
