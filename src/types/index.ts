
// Student
export interface Student {
  id: string;
  name: string;
  rollNo: string;
  roomNo: string;
  contactNumber: string;
  email: string;
}

// Room
export interface Room {
  id: string;
  roomNo: string;
  capacity: number;
  occupied: number;
  status: 'Available' | 'Full' | 'Maintenance';
}

// Leave Request
export interface LeaveRequest {
  id: string;
  studentName: string;
  rollNo: string;
  roomNo: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  submissionDate: string;
}

// Complaint
export interface Complaint {
  id: string;
  studentName: string;
  rollNo: string;
  roomNo: string;
  description: string;
  submissionDate: string;
  status: 'Resolved' | 'Pending';
}

// Inquiry
export interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submissionDate: string;
  status: 'Read' | 'Unread';
}
