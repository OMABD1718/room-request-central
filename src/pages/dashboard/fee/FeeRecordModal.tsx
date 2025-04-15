
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Student {
  id: string;
  name: string;
  roll_no: string;
  room_no: string;
}

interface FeeRecord {
  id: string;
  student_id: string;
  amount: number;
  due_date: string;
  payment_date: string | null;
  status: 'Paid' | 'Due';
}

interface FeeRecordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feeRecord: FeeRecord | null;
  students: Student[];
  onSuccess: () => void;
}

const feeRecordSchema = z.object({
  student_id: z.string({
    required_error: "Student is required",
  }),
  amount: z.string().transform(Number).pipe(
    z.number().positive('Amount must be positive')
  ),
  due_date: z.date({
    required_error: "Due date is required",
  }),
});

type FeeRecordFormValues = z.infer<typeof feeRecordSchema>;

const FeeRecordModal = ({ 
  open, 
  onOpenChange, 
  feeRecord, 
  students,
  onSuccess 
}: FeeRecordModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FeeRecordFormValues>({
    resolver: zodResolver(feeRecordSchema),
    defaultValues: feeRecord ? {
      student_id: feeRecord.student_id,
      amount: String(feeRecord.amount),
      due_date: new Date(feeRecord.due_date),
    } : {
      student_id: '',
      amount: '',
      due_date: new Date(),
    },
  });

  // Reset form when feeRecord changes
  useState(() => {
    if (open) {
      form.reset(feeRecord ? {
        student_id: feeRecord.student_id,
        amount: String(feeRecord.amount),
        due_date: new Date(feeRecord.due_date),
      } : {
        student_id: '',
        amount: '',
        due_date: new Date(),
      });
    }
  });

  const handleSubmit = async (values: FeeRecordFormValues) => {
    setIsSubmitting(true);
    try {
      const feeData = {
        student_id: values.student_id,
        amount: values.amount,
        due_date: values.due_date.toISOString(),
        status: 'Due',
      };

      if (feeRecord) {
        // Update existing fee record
        const { error } = await supabase
          .from('fee_records')
          .update(feeData)
          .eq('id', feeRecord.id);
        
        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Fee record updated successfully',
        });
      } else {
        // Add new fee record
        const { error } = await supabase
          .from('fee_records')
          .insert([feeData]);
        
        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Fee record added successfully',
        });
      }
      
      onOpenChange(false);
      onSuccess();
    } catch (error) {
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
          <DialogTitle>{feeRecord ? 'Edit Fee Record' : 'Add New Fee Record'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="student_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} - {student.roll_no}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                {isSubmitting ? 'Saving...' : feeRecord ? 'Save Changes' : 'Add Fee Record'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FeeRecordModal;
