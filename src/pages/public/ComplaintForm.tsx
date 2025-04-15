
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ComplaintForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    studentName: '',
    rollNo: '',
    roomNo: '',
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

    // Simulate API request
    setTimeout(() => {
      toast({
        title: "Complaint submitted",
        description: "Your complaint has been registered. We'll address it as soon as possible.",
      });
      
      // Reset form
      setFormData({
        studentName: '',
        rollNo: '',
        roomNo: '',
        description: '',
      });
      
      setLoading(false);
    }, 1000);
  };

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
