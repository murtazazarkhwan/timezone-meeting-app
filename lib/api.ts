import { Schedule, ISchedule } from "@/lib/models/Schedule";
import { toast } from "react-toastify";

//get schedule by id
export async function getSchedule(scheduleId: string) {
  const res = await fetch(`/api/schedules/${scheduleId}`);
  if (!res.ok) throw new Error("Failed to fetch schedule");
  const data = await res.json();
  localStorage.setItem("ip", data?.id);
  return data;
}

//get participents with schedule id
export async function getParticipantsBySchedule(scheduleId: string) {
  const res = await fetch(`/api/participants/${scheduleId}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch participants");
  }
  const data = await res.json();
  localStorage.setItem("ip", data?.id);
  return data;
}

//get time slots by schedule id
export async function getTimeSlotsBySchedule(scheduleId: string) {
  const res = await fetch(`/api/time-slots/${scheduleId}`);
  if (!res.ok) throw new Error("Failed to fetch time slots");
  const data = await res.json();
  console.log("data", data);
  return data;
}

// ✅ Combined function to add participant with time slots
export async function addParticipant({
  scheduleId,
  name,
  timezone,
  selectedSlots,
}: {
  scheduleId: string;
  name: string;
  timezone: string;
  selectedSlots: Array<{
    startTime: string;
    // endTime: string;
    day: number;
    timezone?: string;
  }>;
}): Promise<{
  id: string;
  name: string;
  selectedSlots: Array<{
    startTime: string;
    // endTime: string;
    day: number;
    timezone: string;
  }>;
}> {
  const res = await fetch("/api/participants", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      scheduleId,
      name,
      timezone,
      selectedSlots: selectedSlots.map((slot) => ({
        ...slot,
        timezone: slot.timezone || timezone,
      })),
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to add participant");
  }

  const data = await res.json();
  toast.success(data.message);
  localStorage.setItem("ip", data?.id);
  return data.participant;
}

// ✅ Add a new time slot
export async function addTimeSlot({
  scheduleId,
  participantId,
  startTime,
  endTime,
  day,
  timezone,
}: {
  scheduleId: string;
  participantId: string;
  startTime: string;
  endTime: string;
  day: number;
  timezone: string;
}): Promise<{ id: string }> {
  const res = await fetch("/api/time-slots", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      scheduleId,
      participantId,
      startTime,
      endTime,
      day,
      timezone,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to add time slot");
  }

  const data = await res.json();
  toast.success(data?.message);
  return { id: data.timeSlotId };
}

// ✅ Add a new schedule
export async function addSchedule({
  adminName,
  timezone,
  startDate,
  slots,
}: {
  adminName: string;
  timezone: string;
  startDate: string;
  slots: any[]; // If you have a Slot type, use it instead of any[]
}): Promise<ISchedule> {
  const res = await fetch("/api/addschedule", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ adminName, timezone, startDate, slots }),
  });

  if (!res.ok) {
    throw new Error("Failed to add schedule");
  }

  const data = await res.json();
  localStorage.setItem("ip", data?.id);
  toast.success(data?.message);
  return data.schedule; // ⬅️ This is how your backend sends it
}
