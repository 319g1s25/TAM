export interface Exam {
    id: number;
    userID: number;        // likely the instructor who created it
    courseID: number;
    date: string;          // use `string` for datetime unless using Date objects directly
    duration: number;
    proctorsRequired: number;
  }
  