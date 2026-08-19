import mongoose from "mongoose";

export interface IUser {
  name: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
  githubToken?: string;
  githubUsername?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    googleId: { type: String },
    githubToken: { type: String },
    githubUsername: { type: String },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
