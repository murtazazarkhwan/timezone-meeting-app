import mongoose, { Document, Schema } from "mongoose";

interface ITimeSlot {
  startTime: Date;
  timezone: string;
  day: number;
}

export interface ISchedule extends Document {
  adminName: string;
  timezone: string;
  startDate: Date;
  shareableLink: string;
  adminSlots: ITimeSlot[];
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string;
}

const ScheduleSchema = new Schema<ISchedule>(
  {
    adminName: { type: String, required: true },
    timezone: { type: String, required: true },
    startDate: { type: Date, required: true },
    shareableLink: { type: String },
    adminSlots: [
      {
        startTime: { type: Date, required: true },
        timezone: { type: String, required: true },
        day: { type: Number, required: true },
      },
    ],
    ipAddress: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Clear any existing model to prevent caching issues
if (mongoose.models.Schedule) {
  delete mongoose.models.Schedule;
}

export const Schedule = mongoose.model<ISchedule>("Schedule", ScheduleSchema);
