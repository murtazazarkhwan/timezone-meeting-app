import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">TimeSync</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/how-it-works">
                <Button variant="ghost">How it works</Button>
              </Link>
              <Link href="/create">
                <Button>Create Schedule</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-background to-muted">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Schedule meetings <span className="text-primary">across timezones</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Find the perfect time to meet with your team, no matter where they are.
              Simple, shareable, and works without any login.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create">
                <Button size="lg" className="gap-2">
                  <Calendar className="h-5 w-5" />
                  Create Schedule
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="bg-primary-foreground w-12 h-12 flex items-center justify-center rounded-full mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Create a schedule</h3>
                <p className="text-muted-foreground">
                  Choose your start day, set your timezone, and mark your availability.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="bg-primary-foreground w-12 h-12 flex items-center justify-center rounded-full mb-4">
                  <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Share with your team</h3>
                <p className="text-muted-foreground">
                  Send a unique link to your team members to collect their availability.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="bg-primary-foreground w-12 h-12 flex items-center justify-center rounded-full mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Find the best time</h3>
                <p className="text-muted-foreground">
                  Everyone's availability is displayed in their local time with overlaps clearly shown.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to get started?</h2>
            <Link href="/create">
              <Button size="lg">Create Your Schedule</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-semibold">TimeSync</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TimeSync. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}