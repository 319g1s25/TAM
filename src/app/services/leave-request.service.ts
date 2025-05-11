import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { NotificationService } from './notification.service';
import { TAService } from './ta.service';

@Injectable({
  providedIn: 'root'
})
export class LeaveReqService {
  private apiUrl = `http://localhost:3000/api/leave-requests`;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private taService: TAService
  ) {}

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
  return this.http.put(`${this.apiUrl}/${id}/status`, data).pipe(
    tap((response: any) => {
      if (response && response.success) {
        const leaveRequest = response.leaveRequest;
        
        // Get TA information to display in notification
        if (leaveRequest && leaveRequest.userId) {
          const taId = parseInt(leaveRequest.userId, 10);
          this.taService.getTA(taId).subscribe((ta: any) => {
            if (ta) {
              // Send notification to the TA
              this.notificationService.notifyLeaveRequest(
                ta.name, 
                data.status === 'Approved',
                taId
              );
              
              // Also send notification to relevant roles only (instructors, department chairs, and dean's office)
              const statusText = data.status === 'Approved' ? 'approved' : 'rejected';
              this.notificationService.addNotification(
                `Leave request for ${ta.name} has been ${statusText}`,
                data.status === 'Approved' ? 'success' : 'warning',
                {
                  event: 'leave_request_admin_notification',
                  entityId: id,
                  roles: ['instructor', 'departmentchair', 'deansoffice']
                }
              );
            }
          });
        }
      }
    })
  );
}


}
