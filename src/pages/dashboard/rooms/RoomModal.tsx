
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
import { useToast } from '@/hooks/use-toast';
import { Room } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface RoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: Room | null;
  onSuccess: () => void;
}

const roomSchema = z.object({
  roomNo: z.string().min(1, 'Room number is required'),
  capacity: z.coerce.number().int().positive('Capacity must be a positive integer'),
  occupied: z.coerce.number().int().min(0, 'Occupied must be a non-negative integer'),
  status: z.enum(['Available', 'Full', 'Maintenance']),
}).refine(data => data.occupied <= data.capacity, {
  message: "Occupied cannot be greater than capacity",
  path: ["occupied"]
});

type RoomFormValues = z.infer<typeof roomSchema>;

const RoomModal = ({ open, onOpenChange, room, onSuccess }: RoomModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: room ? {
      roomNo: room.roomNo,
      capacity: room.capacity,
      occupied: room.occupied,
      status: room.status,
    } : {
      roomNo: '',
      capacity: 2,
      occupied: 0,
      status: 'Available',
    },
  });

  // Reset form when room changes
  useState(() => {
    if (open) {
      form.reset(room ? {
        roomNo: room.roomNo,
        capacity: room.capacity,
        occupied: room.occupied,
        status: room.status,
      } : {
        roomNo: '',
        capacity: 2,
        occupied: 0,
        status: 'Available',
      });
    }
  });

  const handleSubmit = async (values: RoomFormValues) => {
    setIsSubmitting(true);
    try {
      const roomData = {
        room_no: values.roomNo,
        capacity: values.capacity,
        occupied: values.occupied,
        status: values.status,
      };

      if (room) {
        // Update existing room
        const { error } = await supabase
          .from('rooms')
          .update(roomData)
          .eq('id', room.id);
        
        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Room updated successfully',
        });
      } else {
        // Add new room
        const { error } = await supabase
          .from('rooms')
          .insert([roomData]);
        
        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Room added successfully',
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
          <DialogTitle>{room ? 'Edit Room' : 'Add New Room'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="occupied"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupied</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Full">Full</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
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
                {isSubmitting ? 'Saving...' : room ? 'Save Changes' : 'Add Room'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomModal;
