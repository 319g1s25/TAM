export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  description: string;
  dueDate: string;
  estimatedHours: number;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTAs: string[]; // Array of TA IDs
  createdAt: string;
} 