// types/comment.ts

export interface Comment {
  _id: string;
  interviewerId: string;
  interviewId: string;
  content: string;
  rating: number;
  createdAt: string | Date;
}
