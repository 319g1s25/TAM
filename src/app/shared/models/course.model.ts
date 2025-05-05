export class Course {
  id?: number;
  course_code!: string;
  code!: string; // Alias for backward compatibility
  name!: string;
  description?: string;
  department!: string;
  credit!: number;
  credits!: number; // Alias for backward compatibility
  semester!: string;
  ta_required!: number;
  taRequirements!: number; // Alias for backward compatibility
  numberOfStudents?: number;
  numberOfTAs?: number;
  instructorName?: string;
}