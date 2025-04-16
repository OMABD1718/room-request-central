
import React, { useState } from 'react';
import { useStudentAuth } from '@/contexts/StudentAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LockKeyhole, IdCard } from 'lucide-react';

const StudentLoginForm = () => {
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useStudentAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(rollNo, password);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Student Login</CardTitle>
        <CardDescription className="text-center">Sign in to submit complaints and leave requests</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rollNo">Roll Number</Label>
            <div className="relative">
              <IdCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="rollNo"
                type="text"
                placeholder="e.g. CS-2025-001"
                className="pl-10"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="********"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              For demo purposes, use any roll number of a student in the system and password "password"
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default StudentLoginForm;
