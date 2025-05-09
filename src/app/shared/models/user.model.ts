export interface User {
    id: string;
    name: string;
    email: string;
    role: 'authstaff' | 'deansoffice' | 'departmentchair' | 'instructor' | 'ta';
  }
  