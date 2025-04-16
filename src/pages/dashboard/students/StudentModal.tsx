
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Student } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface StudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onSuccess: () => void;
}

const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  rollNo: z.string().min(1, 'Roll number is required'),
  roomNo: z.string().min(1, 'Room number is required'),
  contactNumber: z.string().min(10, 'Contact number must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
});

type StudentFormValues = z.infer<typeof studentSchema>;

const StudentModal = ({ open, onOpenChange, student, onSuccess }: StudentModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: student || {
      name: '',
      rollNo: '',
      roomNo: '',
      contactNumber: '',
      email: '',
    },
  });

  // Reset form when student changes or modal opens/closes
  useEffect(() => {
    if (open) {
      form.reset(student || {
        name: '',
        rollNo: '',
        roomNo: '',
        contactNumber: '',
        email: '',
      });
    }
  }, [open, student, form]);

  // Convert form values to database format
  const adaptFormToDB = (values: StudentFormValues) => {
    return {
      name: values.name,
      roll_no: values.rollNo,
      room_no: values.roomNo,
      contact_number: values.contactNumber,
      email: values.email
    };
  };

  const handleSubmit = async (values: StudentFormValues) => {
    setIsSubmitting(true);
    try {
      const dbValues = adaptFormToDB(values);
      
      if (student) {
        // Update existing student
        const { error } = await supabase
          .from('students')
          .update(dbValues)
          .eq('id', student.id);
        
        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Student updated successfully',
        });
      } else {
        // Add new student
        const { error } = await supabase
          .from('students')
          .insert([dbValues]);
        
        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Student added successfully',
        });
      }
      
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error submitting student form:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{student ? 'Edit Student' : 'Add New Student'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rollNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roll Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="CS-2025-001" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="roomNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="A-101" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="+1234567890" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="john.doe@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : student ? 'Save Changes' : 'Add Student'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentModal;
