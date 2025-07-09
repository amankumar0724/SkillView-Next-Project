import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  content: string;
  rating: number;
  interviewerId: string;
  interviewId: mongoose.Types.ObjectId;
}

const CommentSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    rating: { type: Number, required: true },
    interviewerId: { type: String, required: true },
    interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true },
  },
  { timestamps: true }
);
CommentSchema.index({ interviewId: 1 });


export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
