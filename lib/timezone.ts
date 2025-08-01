import { utcToZonedTime, zonedTimeToUtc, format } from "date-fns-tz";

export const timezones = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu", // ✅ Fixed
  "America/Toronto",
  "America/Vancouver",
  "America/Mexico_City",
  "America/Bogota",
  "America/Lima",
  "America/Santiago",
  "America/Sao_Paulo",
  "America/Buenos_Aires",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Rome",
  "Europe/Madrid",
  "Europe/Amsterdam",
  "Europe/Zurich",
  "Europe/Stockholm",
  "Europe/Vienna",
  "Europe/Moscow",
  "Asia/Istanbul",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Asia/Shanghai",
  "Asia/Hong_Kong",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Australia/Perth",
  "Pacific/Auckland",
];

// Get local timezone
export function getLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// Format time for display in a specific timezone
export function formatInTimezone(
  date: Date | string,
  timezone: string,
  formatStr: string = "HH:mm"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const zonedDate = utcToZonedTime(dateObj, timezone);
  return format(zonedDate, formatStr, { timeZone: timezone });
}

// Convert a date from one timezone to another
export function convertTimezone(
  date: Date | string,
  fromTimezone: string,
  toTimezone: string
): Date {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const utcDate = zonedTimeToUtc(dateObj, fromTimezone);
  return utcToZonedTime(utcDate, toTimezone);
}

// Convert a local date to UTC
export function localToUTC(date: Date | string, timezone: string): Date {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return zonedTimeToUtc(dateObj, timezone);
}

// Convert a UTC date to local
export function utcToLocal(date: Date | string, timezone: string): Date {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return utcToZonedTime(dateObj, timezone);
}

// Get timezone display name with UTC offset
export function getTimezoneDisplayName(timezone: string): string {
  const now = new Date();
  const timeZoned = utcToZonedTime(now, timezone);

  // Format the timezone offset
  const offset = format(timeZoned, "XXX", { timeZone: timezone });

  // Get the timezone name without region
  const timezoneParts = timezone.split("/");
  const timezoneName = timezoneParts[timezoneParts.length - 1].replace(
    /_/g,
    " "
  );

  return `${timezoneName} (GMT${offset})`;
}

// Generate time slots for a day
export function generateTimeSlots(
  date: Date,
  timezone: string,
  intervalMinutes: number = 30
): { start: Date; end: Date; key: string }[] {
  const slots = [];
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);

  const endDay = new Date(day);
  endDay.setDate(endDay.getDate() + 1);

  let currentTime = day;

  while (currentTime < endDay) {
    const startTime = new Date(currentTime);

    currentTime = new Date(currentTime);
    currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);

    if (currentTime <= endDay) {
      const endTime = new Date(currentTime);
      const key = `${format(startTime, "HH:mm")}-${format(endTime, "HH:mm")}`;

      slots.push({
        start: startTime,
        end: endTime,
        key,
      });
    }
  }

  return slots;
}

// Get day names for a week starting from a specific date
export function getWeekDayNames(
  startDate: Date | string,
  format: "short" | "long" = "short"
): string[] {
  const dateObj =
    typeof startDate === "string" ? new Date(startDate) : startDate;
  const dayNames = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(dateObj);
    day.setDate(day.getDate() + i);
    dayNames.push(
      day.toLocaleDateString("en-US", {
        weekday: format,
        month: "short",
        day: "numeric",
      })
    );
  }

  return dayNames;
}
