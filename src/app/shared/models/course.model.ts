export class Course {
  id!: number;
  code!: string;
  name!: string;
  description!: string;
  department!: string;
  credits!: number;
  semester!: string;
  instructorId?: number;
  instructorName?: string;
  numberOfStudents?: number;
  numberOfTAs?: number;
  taRequirements?: number;
}
  