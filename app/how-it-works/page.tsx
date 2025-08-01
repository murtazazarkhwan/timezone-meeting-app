import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">How TimeSync Works</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Finding the perfect meeting time shouldn't be complicated</h2>
            <p className="text-lg text-muted-foreground mb-6">
              TimeSync makes it easy to coordinate schedules across different timezones without requiring anyone to create an account.
            </p>
          </section>

          <section className="space-y-12 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              <div className="md:col-span-3">
                <h3 className="text-2xl font-semibold mb-3">1. Create a schedule</h3>
                <p className="text-muted-foreground mb-4">
                  As the organizer, you'll create a new schedule by selecting a start day (e.g., Monday), setting your timezone, and marking your available time slots for the next 7 days.
                </p>
                <p className="text-muted-foreground">
                  You'll get a unique link that you can share with your team members.
                </p>
              </div>
              <div className="md:col-span-2 bg-muted rounded-lg p-6">
                <div className="aspect-[4/3] bg-card rounded-md flex items-center justify-center">
                  <span className="text-4xl">1</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              <div className="md:col-span-2 md:order-first order-last bg-muted rounded-lg p-6">
                <div className="aspect-[4/3] bg-card rounded-md flex items-center justify-center">
                  <span className="text-4xl">2</span>
                </div>
              </div>
              <div className="md:col-span-3">
                <h3 className="text-2xl font-semibold mb-3">2. Share with participants</h3>
                <p className="text-muted-foreground mb-4">
                  Share your unique schedule link with everyone who needs to participate. They'll only need to enter their name and select their timezone.
                </p>
                <p className="text-muted-foreground">
                  No accounts, no passwords, no hassle. Just simple sharing.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              <div className="md:col-span-3">
                <h3 className="text-2xl font-semibold mb-3">3. Everyone marks availability</h3>
                <p className="text-muted-foreground mb-4">
                  Each participant sees the 7-day grid in their local timezone and marks when they're available. The system automatically handles timezone conversions.
                </p>
                <p className="text-muted-foreground">
                  As more people mark their availability, the grid updates to show overlapping free times.
                </p>
              </div>
              <div className="md:col-span-2 bg-muted rounded-lg p-6">
                <div className="aspect-[4/3] bg-card rounded-md flex items-center justify-center">
                  <span className="text-4xl">3</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              <div className="md:col-span-2 md:order-first order-last bg-muted rounded-lg p-6">
                <div className="aspect-[4/3] bg-card rounded-md flex items-center justify-center">
                  <span className="text-4xl">4</span>
                </div>
              </div>
              <div className="md:col-span-3">
                <h3 className="text-2xl font-semibold mb-3">4. Find the optimal time</h3>
                <p className="text-muted-foreground mb-4">
                  The schedule visually highlights times when most people are available, making it easy to identify the best meeting times.
                </p>
                <p className="text-muted-foreground">
                  As the organizer, you can export the results to a CSV file for your records.
                </p>
              </div>
            </div>
          </section>

          <section className="text-center py-6">
            <h2 className="text-2xl font-bold mb-6">Ready to coordinate your next meeting?</h2>
            <Link href="/create">
              <Button size="lg">Create Your Schedule</Button>
            </Link>
          </section>
        </div>
      </main>

      <footer className="border-t py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TimeSync. All rights reserved.
        </div>
      </footer>
    </div>
  );
}