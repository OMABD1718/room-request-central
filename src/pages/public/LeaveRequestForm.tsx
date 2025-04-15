
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const LeaveRequestForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    studentName: '',
    rollNo: '',
    roomNo: '',
    reason: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format dates properly for the database
      const today = new Date();
      const formattedSubmissionDate = format(today, "yyyy-MM-dd'T'HH:mm:ss'Z'");

      // Insert data into Supabase
      const { error } = await supabase
        .from('leave_requests')
        .insert({
          student_name: formData.studentName,
          roll_no: formData.rollNo,
          room_no: formData.roomNo,
          reason: formData.reason,
          start_date: formData.startDate,
          end_date: formData.endDate,
          submission_date: formattedSubmissionDate
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Leave request submitted",
        description: "Your request has been submitted successfully. You will be notified once it's processed.",
      });
      
      // Reset form
      setFormData({
        studentName: '',
        rollNo: '',
        roomNo: '',
        reason: '',
        startDate: '',
        endDate: '',
      });
    } catch (error: any) {
      console.error('Error submitting leave request:', error);
      toast({
        title: "Submission failed",
        description: error.message || "There was an error submitting your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Leave Request Form</CardTitle>
          <CardDescription>Submit your leave request for approval</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                name="studentName"
                placeholder="Enter your full name"
                required
                value={formData.studentName}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rollNo">Roll Number</Label>
                <Input
                  id="rollNo"
                  name="rollNo"
                  placeholder="e.g. HMS001"
                  required
                  value={formData.rollNo}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomNo">Room Number</Label>
                <Input
                  id="roomNo"
                  name="roomNo"
                  placeholder="e.g. A101"
                  required
                  value={formData.roomNo}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Leave</Label>
              <Textarea
                id="reason"
                name="reason"
                placeholder="Please provide details about your leave"
                required
                value={formData.reason}
                onChange={handleChange}
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Leave Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveRequestForm;
