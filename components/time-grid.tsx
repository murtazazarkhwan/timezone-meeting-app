"use client";

import { useEffect, useMemo } from "react";
import { format, addDays } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

interface TimeGridProps {
  startDate: Date;
  timezone: string;
  selectedSlots?: string[];
  participantData?: Record<
    string,
    { selectedSlots: string[]; timezone: string }
  >;
  adminSlots?: string[];
  editable?: boolean;
  schedule: { ipAddress?: string; timezone?: string };
  participents: Array<{ ipAddress?: string; timezone?: string; name?: string }>;
  onSelectSlots?: (slots: string[]) => void;
  setDisplayTimezone: React.Dispatch<React.SetStateAction<string>>;
}

export const TimeGrid = ({
  startDate,
  timezone,
  selectedSlots = [],
  participantData = {},
  adminSlots = [],
  editable = false,
  onSelectSlots,
  participents = [],
  schedule,
  setDisplayTimezone,
}: TimeGridProps) => {
  const storeIp =
    typeof window !== "undefined" ? localStorage.getItem("ip") : null;

  // Determine matched timezone based on IP
  const matchedTimezone = useMemo(() => {
    if (!storeIp) return timezone;
    if (schedule?.ipAddress === storeIp) return schedule.timezone || timezone;
    const participant = participents.find((p) => p.ipAddress === storeIp);
    return participant?.timezone || timezone;
  }, [storeIp, schedule, participents, timezone]);

  setDisplayTimezone(matchedTimezone);

  // Convert slots to target timezone
  const convertSlots = (slots: string[], targetTz: string) => {
    return slots.map((slot) => {
      const [date, time] = slot.split("_");
      const utcDate = new Date(`${date}T${time}:00Z`);
      const zonedDate = utcToZonedTime(utcDate, targetTz);
      return `${format(zonedDate, "yyyy-MM-dd")}_${format(zonedDate, "HH:mm")}`;
    });
  };

  // Convert all slots to matched timezone
  const convertedAdminSlots = useMemo(
    () => (adminSlots ? convertSlots(adminSlots, matchedTimezone) : []),
    [adminSlots, matchedTimezone]
  );

  const convertedParticipantData = useMemo(() => {
    const result: Record<
      string,
      { selectedSlots: string[]; timezone: string }
    > = {};
    Object.entries(participantData).forEach(([name, data]) => {
      const participant = participents.find((p) => p.name === name);
      const participantTz = participant?.timezone || data.timezone;
      result[name] = {
        selectedSlots: convertSlots(data.selectedSlots, matchedTimezone),
        timezone: participantTz,
      };
    });
    return result;
  }, [participantData, participents]);

  const days = useMemo(
    () => Array.from({ length: 7 }).map((_, i) => addDays(startDate, i)),
    [startDate]
  );

  const times = useMemo(
    () =>
      Array.from({ length: 48 }).map(
        (_, i) =>
          `${Math.floor(i / 2)
            .toString()
            .padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`
      ),
    []
  );

  const handleSlotClick = (day: Date, time: string) => {
    if (!editable || !onSelectSlots) return;
    const slotKey = `${format(day, "yyyy-MM-dd")}_${time}`;
    onSelectSlots(
      selectedSlots.includes(slotKey)
        ? selectedSlots.filter((s) => s !== slotKey)
        : [...selectedSlots, slotKey]
    );
  };

  const getSlotInfo = (day: Date, time: string) => {
    const slotKey = `${format(day, "yyyy-MM-dd")}_${time}`;
    const participants: { name: string; timezone: string }[] = [];
    let isAdminSlot = false;

    if (convertedAdminSlots.includes(slotKey)) {
      participants.push({ name: "Admin", timezone: matchedTimezone });
      isAdminSlot = true;
    }

    Object.entries(convertedParticipantData).forEach(([name, data]) => {
      if (data.selectedSlots.includes(slotKey)) {
        participants.push({ name, timezone: data.timezone });
      }
    });

    return {
      participants,
      count: participants.length,
      isAdminSlot,
      participantNames: participants.map((p) => p.name).join(", "),
    };
  };

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-flow-col auto-cols-fr gap-px bg-border">
        {days.map((day) => (
          <div key={day.toString()} className="bg-background">
            <div className="sticky left-0 p-2 text-center font-medium bg-background">
              {format(day, "EEE, MMM d")}
            </div>
            <div className="grid gap-px">
              {times.map((time) => {
                const slotKey = `${format(day, "yyyy-MM-dd")}_${time}`;
                const isSelected = selectedSlots.includes(slotKey);
                const { count, isAdminSlot, participantNames } = getSlotInfo(
                  day,
                  time
                );
                const opacity = Math.min(0.2 + count * 0.2, 0.8);

                return (
                  <button
                    key={time}
                    type="button"
                    className={`h-8 text-xs relative group ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : count > 0 || isAdminSlot
                        ? "bg-primary/20"
                        : "bg-muted/20 hover:bg-muted/50"
                    }`}
                    style={{
                      backgroundColor:
                        count > 0 || isAdminSlot
                          ? `rgba(24, 160, 88, ${opacity})`
                          : undefined,
                    }}
                    onClick={() => handleSlotClick(day, time)}
                    disabled={!editable}
                    aria-label={`${time} - ${participantNames || "Available"}`}
                  >
                    {time}
                    {(count > 0 || isAdminSlot) && (
                      <div className="absolute hidden group-hover:block z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap">
                        {participantNames || "Available"}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
