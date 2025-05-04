export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'coordinator' | 'authstaff' | 'deansoffice' | 'departmentchair' | 'instructor' | 'ta';
  }
  