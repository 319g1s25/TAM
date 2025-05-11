export interface WorkloadEntry {
    id: number;
    ta_id: number;
    assignment_id: number;
    course_id: number;
    date: Date;
    hours: number;
    description: string;
    approved: boolean | null;
  }
  