export interface footerProps {
    fullName: string;
    studentId: string;
    year: string;
  }

export interface Payload {
  username: string;
  studentId: string;
  role: string;
}

export interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  program: string;
}

export interface Course {
  courseNo: string;
  title: string;
  course: Course;
}

export interface Enrollment {
  studentId: string;
  courseNo: string;
}

export interface User {
  username: string;
  password:  string;
  studentId:  string;
  role:  string;
}

export interface Database {
  students: Student[];
  courses: Course[];
  enrollments: Enrollment[];
  users: User[];
}