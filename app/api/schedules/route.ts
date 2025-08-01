// src/app/api/schedule/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Schedule } from "@/lib/models/Schedule";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { adminName, adminTimezone, startDate } = body;

    const schedule = await Schedule.create({
      adminName,
      adminTimezone,
      startDate,
    });

    return NextResponse.json(
      { message: "Schedule created", scheduleId: schedule._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.json(
      { error: "Failed to create schedule" },
      { status: 500 }
    );
  }
}
