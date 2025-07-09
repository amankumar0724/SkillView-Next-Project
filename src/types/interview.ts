// types/interview.ts

export type InterviewStatus = "pending" | "live" | "completed" | "failed" | "succeeded";

export interface InterviewPlain {
  _id: string;
  title: string;
  description: string;
  startTime: number;
  status: InterviewStatus;
  streamCallId: string;
  candidateId: string;
  interviewerIds: string[];
}
