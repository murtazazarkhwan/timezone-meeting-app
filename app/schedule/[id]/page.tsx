"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Users, Download } from "lucide-react";
import { TimeGrid } from "@/components/time-grid";
import { TimezoneSelector } from "@/components/timezone-selector";
import { toast } from "react-toastify";
import {
  getSchedule,
  getParticipantsBySchedule,
  getTimeSlotsBySchedule,
  addParticipant,
  addTimeSlot,
} from "@/lib/api";
import { getLocalTimezone } from "@/lib/timezone";
import { format, parseISO } from "date-fns";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";

export default function SchedulePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [schedule, setSchedule] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [participantName, setParticipantName] = useState("");
  const [participantTimezone, setParticipantTimezone] = useState(
    getLocalTimezone()
  );
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayTimezone, setDisplayTimezone] = useState(getLocalTimezone());
  const [activeTab, setActiveTab] = useState("view");

  interface Participant {
    _id: string;
    name: string;
    timezone: string;
    ipAddress?: string;
    selectedSlots?: Array<{
      startTime: string;
      // endTime: string;
      day: number;
      timezone?: string;
    }>;
  }

  interface ParticipantSlotData {
    selectedSlots: string[];
    timezone: string;
  }

  const participantDataForGrid = participants?.reduce(
    (acc: Record<string, ParticipantSlotData>, participant: Participant) => {
      if (!participant?.selectedSlots?.length) return acc;

      const formattedSlots = participant.selectedSlots
        .map((slot) => {
          if (!slot.startTime) return null;
          try {
            const [datePart, timePart] = slot.startTime.split("T");
            const time = timePart?.slice(0, 5); // HH:mm
            return `${datePart}_${time}`;
          } catch (error) {
            console.error("Slot parsing error:", error);
            return null;
          }
        })
        .filter((slot): slot is string => slot !== null);

      acc[participant.name] = {
        selectedSlots: formattedSlots,
        timezone: participant.timezone,
      };

      return acc;
    },
    {} as Record<string, ParticipantSlotData>
  );

  const adminSlotsForDisplay = schedule?.adminSlots
    ?.map((slot: any) => {
      if (!slot.startTime) return null;

      try {
        const [datePart, timePart] = slot.startTime.split("T");
        const time = timePart?.slice(0, 5); // HH:mm
        return `${datePart}_${time}`;
      } catch (error) {
        console.error("Slot parsing error:", error);
        return null;
      }
    })
    .filter(Boolean);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const scheduleData = await getSchedule(params.id);
        if (!scheduleData) {
          toast.error("Schedule not found");
          router.push("/");
          return;
        }
        setSchedule(scheduleData?.data);
        const participantsData = await getParticipantsBySchedule(params.id);
        setParticipants(participantsData?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load schedule data");
      } finally {
        setLoading(false);
      }
    };

    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) {
        fetchData();
      }
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [params.id, router]);

  const handleSaveAvailability = async () => {
    if (!schedule) return;
    if (!participantName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (selectedSlots?.length === 0) {
      toast.error("Please select at least one time slot");
      return;
    }

    setSaving(true);
    try {
      const slotsData = selectedSlots?.map((slotKey) => {
        const [dateStr, timeStr] = slotKey.split("_");
        const localDateTime = `${dateStr}T${timeStr}:00`;

        return {
          startTime: localDateTime, // Send as-is without conversion
          timezone: participantTimezone,
          day: new Date(localDateTime).getDay(),
        };
      });

      const participant = await addParticipant({
        scheduleId: schedule?._id,
        name: participantName,
        timezone: participantTimezone,
        selectedSlots: slotsData,
      });

      setParticipants([...participants, participant]);
      toast.success("Availability saved successfully!");
      setParticipantName("");
      setParticipantTimezone("");
      setSelectedSlots([]);
      setActiveTab("view");
    } catch (error) {
      console.error("Error saving availability:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save availability"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleExportCSV = () => {
    try {
      const formatLocalTime = (utcDate: string, timezone: string) => {
        try {
          const date = new Date(utcDate);
          return date
            .toLocaleString("en-US", {
              timeZone: timezone,
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
            .replace(",", "");
        } catch (e) {
          console.error("Time conversion error:", e);
          return "Invalid Date";
        }
      };

      let csv = "Participant Name,Timezone,Day,Start Time (Local)\n";

      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      participants?.forEach((participant) => {
        const timezone = participant?.timezone || "UTC";
        const slots = participant?.selectedSlots || [];

        slots?.forEach((slot: any) => {
          const localStart = formatLocalTime(slot.startTime, timezone);
          const dayName = dayNames[slot.day] || `Day ${slot.day}`;
          csv += `"${participant.name.replace(/"/g, '""')}",`;
          csv += `"${timezone}",`;
          csv += `"${dayName}",`;
          csv += `"${localStart}"\n`;
        });
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `availability-export-${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("CSV exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export CSV");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-muted rounded mb-4"></div>
          <div className="text-muted-foreground">Loading schedule...</div>
        </div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Schedule not found</h2>
          <p className="text-muted-foreground mb-6">
            The schedule you're looking for doesn't exist or may have been
            removed.
          </p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold">
                {schedule.adminName}'s Schedule
              </h1>
            </div>
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleExportCSV}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="max-w-5xl mx-auto"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="view">View Schedule</TabsTrigger>
            <TabsTrigger value="add">Add Your Availability</TabsTrigger>
          </TabsList>

          <TabsContent value="view">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Team Availability</CardTitle>
                <CardDescription>
                  All times displayed in {displayTimezone} timezone
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">
                      Participants ({participants.length + 1})
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="bg-primary/20 text-xs px-2 py-1 rounded-full">
                      {schedule?.adminName} (Admin)
                    </div>
                    {participants?.map((participant) => (
                      <div
                        key={participant.id}
                        className="bg-muted text-xs px-2 py-1 rounded-full"
                      >
                        {participant?.name}
                      </div>
                    ))}
                  </div>
                </div>

                {schedule?.startDate && (
                  <TimeGrid
                    startDate={new Date(schedule.startDate)}
                    timezone={displayTimezone}
                    selectedSlots={selectedSlots}
                    participantData={participantDataForGrid}
                    adminSlots={adminSlotsForDisplay}
                    editable={false}
                    schedule={schedule}
                    participents={participants}
                    setDisplayTimezone={setDisplayTimezone}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Add Your Availability</CardTitle>
                <CardDescription>
                  Enter your name, select your timezone, and mark when you're
                  available on the grid.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={participantName}
                      onChange={(e) => setParticipantName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Your Timezone</Label>
                    <TimezoneSelector
                      value={participantTimezone}
                      onValueChange={setParticipantTimezone}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-2">
                    Select Available Time Slots
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click or drag to select multiple time slots. The grid is
                    shown in your local timezone.
                  </p>

                  {schedule.startDate && (
                    <TimeGrid
                      startDate={new Date(schedule.startDate)}
                      timezone={participantTimezone}
                      selectedSlots={selectedSlots}
                      onSelectSlots={setSelectedSlots}
                      editable={true}
                      schedule={schedule}
                      participents={participants}
                      setDisplayTimezone={setDisplayTimezone}
                    />
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveAvailability}
                    disabled={
                      saving ||
                      selectedSlots.length === 0 ||
                      !participantName.trim()
                    }
                  >
                    {saving ? "Saving..." : "Save Availability"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
