import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Schedule } from "@/lib/models/Schedule";
import { zonedTimeToUtc } from "date-fns-tz";

export async function POST(req: Request) {
  try {
    const connection = await connectToDatabase();
    if (!connection) throw new Error("Database connection failed");

    const origin =
      req.headers.get("origin") ||
      req.headers.get("host") ||
      process.env.NEXTAUTH_URL ||
      "https://meeting-app-ebon-mu.vercel.app/";
    const baseUrl = origin.startsWith("http") ? origin : `https://${origin}`;
    const ip = req.headers.get("x-client-ip") || "unknown";

    const body = await req.json();
    const { adminName, timezone, startDate, slots } = body;

    const utcSlots = slots?.map((slot: any) => ({
      startTime: zonedTimeToUtc(slot.startTime, timezone),
      // endTime: zonedTimeToUtc(slot.endTime, adminTimezone),
      timezone: timezone,
      day: slot.day,
    }));

    const schedule = await Schedule.create({
      adminName,
      timezone,
      startDate: new Date(startDate),
      adminSlots: utcSlots,
      ipAddress: ip,
    });

    const scheduleLink = `${baseUrl}/schedule/${schedule._id}`;
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      schedule._id,
      { shareableLink: scheduleLink },
      { new: true }
    );

    if (!updatedSchedule) throw new Error("Failed to update schedule");

    return NextResponse.json(
      {
        message: "Schedule created successfully",
        schedule: updatedSchedule.toObject(),
        shareableLink: scheduleLink,
        slots: updatedSchedule.adminSlots,
        id: ip,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Failed to create schedule",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
