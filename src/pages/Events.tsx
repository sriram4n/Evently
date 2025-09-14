import { useEffect, useState } from "react";
import { fetchEvents } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchEvents().then(setEvents).catch(err => console.error("fetchEvents failed:", err));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>All Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {events.length === 0 && <p className="text-muted-foreground">No events yet</p>}
            {events.map(ev => (
              <div key={ev.id} className="p-4 border rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold">{ev.name}</h2>
                <p className="text-sm text-gray-500">{ev.date} — {ev.location}</p>
                <p className="mt-1">{ev.description}</p>
                <p className="mt-1 text-sm text-muted-foreground">Skills: {ev.required_skills}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="mt-6 text-center">
          <Link to="/">
            <Button variant="outline">← Back to Home</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
