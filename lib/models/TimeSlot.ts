import mongoose, { Document, Schema } from "mongoose";

// TimeSlot Interface
export interface ITimeSlot extends Document {
  scheduleId: mongoose.Schema.Types.ObjectId;
  participantId: mongoose.Schema.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  timezone: string;
  day: number;
  createdAt: Date;
  updatedAt: Date;
}

// TimeSlot Schema
const TimeSlotSchema = new Schema<ITimeSlot>(
  {
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
    participantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
      required: true,
    },
    timezone: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    day: { type: Number, required: true },
  },
  { timestamps: true }
);

// Export TimeSlot Model
export const TimeSlot =
  mongoose.models.TimeSlot ||
  mongoose.model<ITimeSlot>("TimeSlot", TimeSlotSchema);
