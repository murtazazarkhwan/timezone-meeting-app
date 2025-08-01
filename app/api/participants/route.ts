import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Participant } from "@/lib/models/Participant";
import mongoose from "mongoose";
import { zonedTimeToUtc } from "date-fns-tz";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const ip = req.headers.get("x-client-ip") || "unknown";
    const { scheduleId, name, timezone, selectedSlots = [] } = await req.json();

    const utcSlots = selectedSlots?.map((slot: any) => ({
      startTime: zonedTimeToUtc(slot.startTime, timezone),
      // endTime: zonedTimeToUtc(slot.endTime, adminTimezone),
      timezone: timezone,
      day: slot.day,
    }));

    if (!scheduleId || !name || !timezone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
      return NextResponse.json(
        { error: "Invalid schedule ID" },
        { status: 400 }
      );
    }

    const participant = await Participant.create({
      scheduleId,
      name,
      timezone,
      ipAddress: ip,
      selectedSlots: utcSlots,
    });

    return NextResponse.json(
      {
        message: "Participant created successfully",
        id: ip,
        participant: {
          id: participant._id,
          name: participant.name,
          timezone: participant.timezone,
          selectedSlots: participant.selectedSlots,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function convertToUTC(dateString: string, timezone: string): Date {
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + offset);
}
