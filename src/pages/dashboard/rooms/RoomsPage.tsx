
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Room } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { Plus, Search, Edit, Trash } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import RoomModal from './RoomModal';

// Adapter function to convert database response to our type
const adaptRoom = (dbRoom: any): Room => ({
  id: dbRoom.id,
  roomNo: dbRoom.room_no,
  capacity: dbRoom.capacity,
  occupied: dbRoom.occupied,
  status: dbRoom.status as 'Available' | 'Full' | 'Maintenance'
});

const fetchRooms = async () => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('room_no', { ascending: true });

  if (error) throw error;
  return data.map(adaptRoom);
};

const RoomsPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const { data: rooms = [], isLoading, error, refetch } = useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
  });

  useEffect(() => {
    document.title = 'Rooms | Hostel Management System';
  }, []);

  const handleAddRoom = () => {
    setEditingRoom(null);
    setIsModalOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleDeleteRoom = async (id: string) => {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Room deleted successfully',
      });
      refetch();
    }
  };

  const filteredRooms = rooms.filter(room => 
    room.roomNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Rooms Management</h1>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search rooms..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-8"
          />
        </div>
        <Button onClick={handleAddRoom}>
          <Plus className="mr-2 h-4 w-4" /> Add Room
        </Button>
      </div>
      
      {error ? (
        <div className="bg-destructive/10 p-4 rounded-md text-destructive">
          Error loading rooms: {(error as Error).message}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableCaption>A list of all hostel rooms</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Room No.</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Occupied</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    Loading rooms...
                  </TableCell>
                </TableRow>
              ) : filteredRooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    {searchTerm ? 'No rooms found matching your search.' : 'No rooms have been added yet.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.roomNo}</TableCell>
                    <TableCell>{room.capacity}</TableCell>
                    <TableCell>{room.occupied}</TableCell>
                    <TableCell>
                      <StatusBadge status={room.status} className="px-2 py-0.5 rounded text-xs font-medium" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditRoom(room)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRoom(room.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <RoomModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        room={editingRoom}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default RoomsPage;
