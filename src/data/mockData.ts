
import { Student, Room, LeaveRequest, Complaint, Inquiry } from '@/types';

// Mock Students
export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'John Doe',
    rollNo: 'HMS001',
    roomNo: 'A101',
    contactNumber: '9876543210',
    email: 'john.doe@example.com'
  },
  {
    id: '2',
    name: 'Jane Smith',
    rollNo: 'HMS002',
    roomNo: 'A102',
    contactNumber: '8765432109',
    email: 'jane.smith@example.com'
  },
  {
    id: '3',
    name: 'Robert Johnson',
    rollNo: 'HMS003',
    roomNo: 'B201',
    contactNumber: '7654321098',
    email: 'robert.johnson@example.com'
  },
  {
    id: '4',
    name: 'Emily Wilson',
    rollNo: 'HMS004',
    roomNo: 'B202',
    contactNumber: '6543210987',
    email: 'emily.wilson@example.com'
  },
  {
    id: '5',
    name: 'Michael Brown',
    rollNo: 'HMS005',
    roomNo: 'C301',
    contactNumber: '5432109876',
    email: 'michael.brown@example.com'
  }
];

// Mock Rooms
export const mockRooms: Room[] = [
  {
    id: '1',
    roomNo: 'A101',
    capacity: 2,
    occupied: 1,
    status: 'Available'
  },
  {
    id: '2',
    roomNo: 'A102',
    capacity: 2,
    occupied: 1,
    status: 'Available'
  },
  {
    id: '3',
    roomNo: 'B201',
    capacity: 3,
    occupied: 2,
    status: 'Available'
  },
  {
    id: '4',
    roomNo: 'B202',
    capacity: 3,
    occupied: 1,
    status: 'Available'
  },
  {
    id: '5',
    roomNo: 'C301',
    capacity: 1,
    occupied: 1,
    status: 'Full'
  },
  {
    id: '6',
    roomNo: 'C302',
    capacity: 1,
    occupied: 0,
    status: 'Maintenance'
  }
];

// Mock Leave Requests
export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    studentName: 'John Doe',
    rollNo: 'HMS001',
    roomNo: 'A101',
    reason: 'Family function',
    startDate: '2025-04-20',
    endDate: '2025-04-25',
    status: 'Approved',
    submissionDate: '2025-04-15'
  },
  {
    id: '2',
    studentName: 'Jane Smith',
    rollNo: 'HMS002',
    roomNo: 'A102',
    reason: 'Medical emergency',
    startDate: '2025-04-18',
    endDate: '2025-04-22',
    status: 'Pending',
    submissionDate: '2025-04-15'
  },
  {
    id: '3',
    studentName: 'Robert Johnson',
    rollNo: 'HMS003',
    roomNo: 'B201',
    reason: 'Internship interview',
    startDate: '2025-04-21',
    endDate: '2025-04-23',
    status: 'Rejected',
    submissionDate: '2025-04-14'
  }
];

// Mock Complaints
export const mockComplaints: Complaint[] = [
  {
    id: '1',
    studentName: 'Emily Wilson',
    rollNo: 'HMS004',
    roomNo: 'B202',
    description: 'Water leakage in bathroom',
    submissionDate: '2025-04-12',
    status: 'Resolved'
  },
  {
    id: '2',
    studentName: 'Michael Brown',
    rollNo: 'HMS005',
    roomNo: 'C301',
    description: 'Faulty electrical socket',
    submissionDate: '2025-04-14',
    status: 'Pending'
  },
  {
    id: '3',
    studentName: 'John Doe',
    rollNo: 'HMS001',
    roomNo: 'A101',
    description: 'Broken window handle',
    submissionDate: '2025-04-15',
    status: 'Pending'
  }
];

// Mock Inquiries
export const mockInquiries: Inquiry[] = [
  {
    id: '1',
    name: 'David Miller',
    email: 'david.miller@example.com',
    subject: 'Accommodation Availability',
    message: 'I would like to know if there are any vacant rooms available for the next semester.',
    submissionDate: '2025-04-10',
    status: 'Read'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    subject: 'Fee Structure',
    message: 'Could you please provide details about the hostel fee structure and payment methods?',
    submissionDate: '2025-04-13',
    status: 'Unread'
  },
  {
    id: '3',
    name: 'Thomas Lee',
    email: 'thomas.lee@example.com',
    subject: 'Hostel Facilities',
    message: 'I am interested in knowing what facilities are available in your hostel premises.',
    submissionDate: '2025-04-15',
    status: 'Unread'
  }
];

// Mock fee data
export const mockFeeData = mockStudents.map(student => ({
  id: student.id,
  studentName: student.name,
  rollNo: student.rollNo,
  roomNo: student.roomNo,
  status: ['Paid', 'Due'][Math.floor(Math.random() * 2)] as 'Paid' | 'Due',
  amount: 15000,
  dueDate: '2025-05-15'
}));
