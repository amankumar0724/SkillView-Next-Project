import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  image?: string;
  role?: "interviewer" | "candidate";
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // Not required because OAuth users might not have passwords
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        enum: ["interviewer", "candidate"],
        default: "candidate",
    },
}, {
    timestamps: true, // This will add createdAt and updatedAt fields
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;