export interface WorkloadEntry {
    id: number;
    taId: number;
    courseId: number;
    date: Date;
    hoursspent: number;
    description: string;
    tasktype: string;
    approved: boolean | null;
  }
  