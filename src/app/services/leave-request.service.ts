import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveReqService {
  private apiUrl = `http://localhost:3000/api/leave-requests`;

  constructor(private http: HttpClient) {}

  // Submit a new leave request
  submitLeaveRequest(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Get all leave requests (for admin/instructor view)
 getAllLeaveRequests(role?: string, userId?: string): Observable<any> {
  let url = this.apiUrl;
  if (role === 'ta' && userId) {
    url += `?role=ta&userId=${userId}`;
  }
  return this.http.get(url);
}

updateLeaveRequestStatus(id: number, data: {
  status: 'Approved' | 'Rejected';
  reviewedBy: string;
  reviewDate: string;
  reviewComments: string;
}): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}/status`, data);
}


}
