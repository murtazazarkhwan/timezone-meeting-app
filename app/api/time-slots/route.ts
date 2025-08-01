// src/app/api/time-slots/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { TimeSlot } from "@/lib/models/TimeSlot";
import mongoose from "mongoose";
import { zonedTimeToUtc } from "date-fns-tz";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Validate required fields
    if (
      !body.participantId ||
      !mongoose.Types.ObjectId.isValid(body.participantId)
    ) {
      return NextResponse.json(
        { error: "Valid participantId is required" },
        { status: 400 }
      );
    }
    if (!body.timezone) {
      return NextResponse.json(
        { error: "Timezone is required" },
        { status: 400 }
      );
    }

    const { scheduleId, participantId, startTime, endTime, day, timezone } =
      body;

    // Convert local times to UTC for storage
    const utcStartTime = zonedTimeToUtc(startTime, timezone);
    const utcEndTime = zonedTimeToUtc(endTime, timezone);

    const timeSlot = await TimeSlot.create({
      scheduleId,
      participantId,
      startTime: utcStartTime,
      endTime: utcEndTime,
      day,
      timezone, // Store original timezone for reference
    });

    return NextResponse.json(
      {
        message: "TimeSlot created",
        timeSlotId: timeSlot._id,
        participantId: timeSlot.participantId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating timeslot:", error);
    return NextResponse.json(
      {
        error: "Failed to create timeslot",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
