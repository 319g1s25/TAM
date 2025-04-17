export interface LeaveRequest {
    id: number;
    taID: number;
    userID: number;
    startDate: string;   // 'date' fields as string (or Date if you prefer)
    endDate: string;
    status: string;
  }
  