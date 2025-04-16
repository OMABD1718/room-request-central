
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudentAuth } from '@/contexts/StudentAuthContext';
import { Navigate } from 'react-router-dom';

const LeaveRequestForm = () => {
  const { toast } = useToast();
  const { student } = useStudentAuth();
  const [formData, setFormData] = useState({
    reason: '',
    startDate: new Date(),
    endDate: new Date(),
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, value: Date | undefined) => {
    if (value) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!student) {
        throw new Error("You must be logged in to submit a leave request");
      }

      // Ensure end date is not before start date
      if (formData.endDate < formData.startDate) {
        throw new Error("End date cannot be before start date");
      }

      const leaveRequestData = {
        student_name: student.name,
        roll_no: student.rollNo,
        room_no: student.roomNo,
        reason: formData.reason,
        start_date: format(formData.startDate, 'yyyy-MM-dd'),
        end_date: format(formData.endDate, 'yyyy-MM-dd'),
        student_id: student.id,
      };

      const { error } = await supabase
        .from('leave_requests')
        .insert([leaveRequestData]);

      if (error) throw error;

      toast({
        title: "Leave request submitted",
        description: "Your leave request has been registered and is pending approval.",
      });
      
      // Reset form
      setFormData({
        reason: '',
        startDate: new Date(),
        endDate: new Date(),
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Redirect to login if not logged in
  if (!student) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Login Required</h2>
        <p className="mb-6">You need to be logged in as a student to submit a leave request.</p>
        <Button asChild>
          <Navigate to="/student-login" replace />
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Leave Request Form</CardTitle>
          <CardDescription>Submit a request for leave from the hostel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentInfo">Student Information</Label>
              <div className="bg-muted p-3 rounded-md">
                <p><strong>Name:</strong> {student.name}</p>
                <p><strong>Roll Number:</strong> {student.rollNo}</p>
                <p><strong>Room Number:</strong> {student.roomNo}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? (
                        format(formData.startDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => handleDateChange('startDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? (
                        format(formData.endDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => handleDateChange('endDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Leave</Label>
              <Textarea
                id="reason"
                name="reason"
                placeholder="Please provide a reason for your leave request"
                required
                value={formData.reason}
                onChange={handleChange}
                rows={4}
              />
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
