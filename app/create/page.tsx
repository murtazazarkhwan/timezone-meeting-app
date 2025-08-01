"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Calendar, Clock, Globe, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimezoneSelector } from "@/components/timezone-selector";
import { DatePicker } from "@/components/date-picker";
import { TimeGrid } from "@/components/time-grid";
import { toast } from "react-toastify";
import { addSchedule } from "@/lib/api";
import { Schedule, ISchedule } from "@/lib/models/Schedule";
import { getLocalTimezone } from "@/lib/timezone";

export default function CreateSchedulePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState(getLocalTimezone());
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [displayTimezone, setDisplayTimezone] = useState(getLocalTimezone());

  interface adminData {
    _id: string;
    name: string;
    timezone: string;
    adminSlots?: Array<{
      startTime: string;
      endTime: string;
      day: number;
      timezone?: string;
    }>;
  }

  const handleNext = () => {
    if (step === 1 && (!name || !timezone)) {
      toast.error("Please enter your name and select your timezone");
      return;
    }

    if (step === 2 && !startDate) {
      toast.error("Please select a start date");
      return;
    }

    if (step === 3 && selectedSlots.length === 0) {
      toast.error("Please select at least one time slot");
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      handleCreateSchedule();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCreateSchedule = async () => {
    if (!startDate) return;

    setLoading(true);

    try {
      // Prepare slots without UTC conversion
      const formattedSlots = selectedSlots.map((slot) => {
        const [dateStr, timeStr] = slot.split("_");

        return {
          startTime: `${dateStr}T${timeStr}:00`, // Local time string only
          timezone: timezone,
          day: new Date(`${dateStr}T${timeStr}:00`).getDay(),
        };
      });

      const schedule: ISchedule = await addSchedule({
        adminName: name,
        timezone: timezone,
        startDate: startDate.toISOString(),
        slots: formattedSlots,
      });

      router.push(`/schedule/${schedule?._id}`);
    } catch (error) {
      console.error("Error creating schedule:", error);
      toast.error("Failed to create schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Create a New Schedule</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > 1 ? <Check className="h-4 w-4" /> : "1"}
              </div>
              <div
                className={`h-px w-12 ${step > 1 ? "bg-primary" : "bg-muted"}`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > 2 ? <Check className="h-4 w-4" /> : "2"}
              </div>
              <div
                className={`h-px w-12 ${step > 2 ? "bg-primary" : "bg-muted"}`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                3
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Step {step} of 3
            </div>
          </div>

          <Card className="shadow-sm">
            {step === 1 && (
              <>
                <CardHeader>
                  <CardTitle className="text-xl">About You</CardTitle>
                  <CardDescription>
                    Let's start with your details. This helps participants
                    identify your schedule.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Your Timezone</Label>
                    <TimezoneSelector
                      value={timezone}
                      onValueChange={setTimezone}
                    />
                  </div>
                </CardContent>
              </>
            )}

            {step === 2 && (
              <>
                <CardHeader>
                  <CardTitle className="text-xl">Pick a Start Date</CardTitle>
                  <CardDescription>
                    Choose the first day of your 7-day schedule. Participants
                    will see a week starting from this date.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Start Date</Label>
                    <DatePicker date={startDate} setDate={setStartDate} />
                  </div>
                </CardContent>
              </>
            )}

            {step === 3 && (
              <>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Mark Your Availability
                  </CardTitle>
                  <CardDescription>
                    Select all time slots when you're available for the meeting.
                    Click or drag to select multiple slots.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {startDate && (
                    <TimeGrid
                      startDate={startDate}
                      timezone={timezone}
                      selectedSlots={selectedSlots}
                      onSelectSlots={setSelectedSlots}
                      editable={true}
                      schedule={{}}
                      participents={[]}
                      setDisplayTimezone={setDisplayTimezone}
                    />
                  )}
                </CardContent>
              </>
            )}

            <CardFooter className="flex justify-between">
              {step > 1 ? (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={loading}
                >
                  Back
                </Button>
              ) : (
                <Link href="/">
                  <Button variant="outline">Cancel</Button>
                </Link>
              )}
              <Button onClick={handleNext} disabled={loading}>
                {step === 3 ? "Create Schedule" : "Next"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
