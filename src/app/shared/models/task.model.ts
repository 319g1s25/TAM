export interface WorkloadEntry {
    id: number;
    taID: number;
    courseID: number;
    date: Date;
    hoursspent: number;
    description: string;
    tasktype: string;
    approved: boolean | null;
  }
  