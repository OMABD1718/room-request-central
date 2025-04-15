
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle, Building2 } from 'lucide-react';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Hostel Management System</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our online system allows students to submit leave requests, 
          file complaints about facilities, and make general inquiries 
          without the need for in-person visits.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-3 w-12 h-12 mx-auto flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl mb-2">Leave Requests</CardTitle>
            <CardDescription className="mb-4">
              Submit your leave application online for quick approval
            </CardDescription>
            <Button className="w-full" asChild>
              <Link to="/leave-request">Submit Request</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-3 w-12 h-12 mx-auto flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl mb-2">Complaints</CardTitle>
            <CardDescription className="mb-4">
              Report maintenance issues or any other hostel-related complaints
            </CardDescription>
            <Button className="w-full" asChild>
              <Link to="/complaint">File Complaint</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-3 w-12 h-12 mx-auto flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl mb-2">General Inquiries</CardTitle>
            <CardDescription className="mb-4">
              Ask questions about hostel facilities, fees, or other information
            </CardDescription>
            <Button className="w-full" asChild>
              <Link to="/inquiry">Make Inquiry</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground mb-4">For administrative access</p>
        <Button variant="outline" asChild>
          <Link to="/login">Admin Login</Link>
        </Button>
      </div>
    </div>
  );
};

export default Home;
