
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useStudentAuth } from '@/contexts/StudentAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';

const ComplaintForm = () => {
  const { toast } = useToast();
  const { student } = useStudentAuth();
  const [formData, setFormData] = useState({
    description: '',
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
      if (!student) {
        throw new Error("You must be logged in to submit a complaint");
      }

      const complaintData = {
        student_name: student.name,
        roll_no: student.rollNo,
        room_no: student.roomNo,
        description: formData.description,
        student_id: student.id,
      };

      const { error } = await supabase
        .from('complaints')
        .insert([complaintData]);

      if (error) throw error;

      toast({
        title: "Complaint submitted",
        description: "Your complaint has been registered. We'll address it as soon as possible.",
      });
      
      // Reset form
      setFormData({
        description: '',
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
        <p className="mb-6">You need to be logged in as a student to file a complaint.</p>
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
          <CardTitle>Complaint Form</CardTitle>
          <CardDescription>Report an issue or complaint regarding hostel facilities</CardDescription>
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
            
            <div className="space-y-2">
              <Label htmlFor="description">Issue Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Please describe the issue in detail"
                required
                value={formData.description}
                onChange={handleChange}
                rows={6}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Complaint"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintForm;
