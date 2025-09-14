import { useState } from "react";
import { createEvent } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

export default function CreateEvent() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name, date, location, description, required_skills: skills };
      const res = await createEvent(payload);
      alert("✅ Event created: " + res.event_id);
      setName(""); setDate(""); setLocation(""); setDescription(""); setSkills("");
    } catch (err: any) {
      console.error("createEvent failed:", err);
      alert("❌ Error creating event");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto shadow-md">
          <CardHeader>
            <CardTitle>Create Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Event Name</Label>
                <Input value={name} onChange={e=>setName(e.target.value)} required placeholder="Hackathon 2025" />
              </div>
              <div>
                <Label>Date</Label>
                <Input type="date" value={date} onChange={e=>setDate(e.target.value)} required />
              </div>
              <div>
                <Label>Location</Label>
                <Input value={location} onChange={e=>setLocation(e.target.value)} required placeholder="Hyderabad" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={description} onChange={e=>setDescription(e.target.value)} required placeholder="Describe the event..." />
              </div>
              <div>
                <Label>Required Skills</Label>
                <Input value={skills} onChange={e=>setSkills(e.target.value)} placeholder="Python, React" />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating..." : "Create Event"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Link to="/">
                <Button variant="outline">← Back to Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
