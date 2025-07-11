import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { addHours, isAfter, isBefore } from "date-fns";
import { isWithinInterval } from "date-fns/isWithinInterval";
import { intervalToDuration } from "date-fns/intervalToDuration";
import { IInterview } from "@/models/interview";
import { IUser } from "@/models/user";
import { InterviewPlain } from "@/types/interview";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
type GroupedInterviews = {
  succeeded?: IInterview[];
  failed?: IInterview[];
  completed?: IInterview[];
  upcoming?: IInterview[];
};


export const groupInterviews = (interviews: IInterview[]): GroupedInterviews => {
  if (!interviews) return {};

  return interviews.reduce((acc: GroupedInterviews, interview: IInterview) => {
    const date = new Date(interview.startTime);
    const now = new Date();

    if (interview.status === "succeeded") {
      acc.succeeded = [...(acc.succeeded || []), interview];
    } else if (interview.status === "failed") {
      acc.failed = [...(acc.failed || []), interview];
    } else if (isBefore(date, now)) {
      acc.completed = [...(acc.completed || []), interview];
    } else if (isAfter(date, now)) {
      acc.upcoming = [...(acc.upcoming || []), interview];
    }

    return acc;
  }, {});
};


export const getCandidateInfo = (users: IUser[], candidateId: string) => {
  const candidate = users?.find((user) => user._id?.toString() === candidateId);
  interface CandidateInfo {
    name: string;
    image: string;
    initials: string;
  }

  return {
    name: candidate?.name || "Unknown Candidate",
    image: candidate?.image || "",
    initials:
      candidate?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("") || "UC",
  } as CandidateInfo;
};

export const getInterviewerInfo = (users: IUser[], interviewerId: string) => {
  const interviewer = users?.find((user) => user._id?.toString() === interviewerId);
  return {
    name: interviewer?.name || "Unknown Interviewer",
    image: interviewer?.image,
    initials:
      interviewer?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("") || "UI",
  };
};

export const calculateRecordingDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const duration = intervalToDuration({ start, end });

  if (duration.hours && duration.hours > 0) {
    return `${duration.hours}:${String(duration.minutes).padStart(2, "0")}:${String(
      duration.seconds
    ).padStart(2, "0")}`;
  }

  if (duration.minutes && duration.minutes > 0) {
    return `${duration.minutes}:${String(duration.seconds).padStart(2, "0")}`;
  }

  return `${duration.seconds} seconds`;
};

export const getMeetingStatus = (interview: IInterview | InterviewPlain) => {
  const now = new Date();
  const interviewStartTime = new Date(interview.startTime);
  const endTime = addHours(interviewStartTime, 1);

  if (
    interview.status === "completed" ||
    interview.status === "failed" ||
    interview.status === "succeeded"
  )
    return "completed";
  if (isWithinInterval(now, { start: interviewStartTime, end: endTime })) return "live";
  if (isBefore(now, interviewStartTime)) return "upcoming";
  return "completed";
};