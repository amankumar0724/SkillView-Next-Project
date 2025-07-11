export interface AppUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  image?: string;
  role: "candidate" | "interviewer" | "admin";
}
