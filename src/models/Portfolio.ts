import mongoose from "mongoose";

export interface IPortfolio {
  userId: mongoose.Types.ObjectId;
  name: string;
  template: string;
  data: Record<string, unknown>;
  repoUrl?: string;
  repoFullName?: string;
  status: "draft" | "generating" | "published" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioSchema = new mongoose.Schema<IPortfolio>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    template: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    repoUrl: { type: String },
    repoFullName: { type: String },
    status: {
      type: String,
      enum: ["draft", "generating", "published", "failed"],
      default: "draft",
      required: true,
    },
  },
  { timestamps: true }
);

// Optimize sorting portfolios by user and updated time (descending)
PortfolioSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.models.Portfolio || mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);
