import mongoose, { Document, Schema } from "mongoose";

interface ITimeSlot {
  startTime: Date;
  // endTime: Date;
  timezone: string;
  day: number;
}

export interface IParticipant extends Document {
  scheduleId: mongoose.Schema.Types.ObjectId;
  name: string;
  timezone: string;
  selectedSlots: ITimeSlot[];
  ipAddress: string;
}

const ParticipantSchema = new Schema<IParticipant>(
  {
    scheduleId: {
      type: Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
    name: { type: String, required: true },
    timezone: { type: String, required: true },
    ipAddress: { type: String, required: true },
    selectedSlots: [
      {
        startTime: { type: Date, required: true },
        // endTime: { type: Date, required: true },
        timezone: { type: String, required: true },
        day: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

delete mongoose.models.Participant;

export const Participant =
  mongoose.models.Participant ||
  mongoose.model<IParticipant>("Participant", ParticipantSchema);
