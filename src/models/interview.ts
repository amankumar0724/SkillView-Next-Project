import mongoose, { Schema, Document } from 'mongoose';

export interface IInterview extends Document {
  title: string;
  description?: string;
  startTime: number;
  endTime?: number;
  status: string;
  streamCallId: string;
  candidateId: string; // Could also be: mongoose.Schema.Types.ObjectId
  interviewerIds: string[]; // Or: mongoose.Types.ObjectId[]
}

const InterviewSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    startTime: { type: Number, required: true },
    endTime: { type: Number },
    status: { type: String, required: true },
    streamCallId: { type: String, required: true, unique: true },
    candidateId: { type: String, required: true },
    interviewerIds: [{ type: String, required: true }],
  },
  { timestamps: true }
);
InterviewSchema.index({ candidateId: 1 });
// InterviewSchema.index({ streamCallId: 1 }, { unique: true });


export default mongoose.models.Interview || mongoose.model<IInterview>('Interview', InterviewSchema);
