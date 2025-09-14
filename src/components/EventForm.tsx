import React, { useState } from "react";
import { createEvent } from "../lib/api";

export default function EventForm() {
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
      console.log("create_event response:", res);
      alert("Event created: " + res.event_id);
      setName(""); setDate(""); setLocation(""); setDescription(""); setSkills("");
    } catch (err: any) {
      console.error("create_event error:", err);
      alert("Error creating event — check console");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-md space-y-3">
      <h3 className="text-lg font-semibold">Create Event</h3>
      <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Event name" className="w-full p-2 border rounded"/>
      <input required value={date} onChange={e=>setDate(e.target.value)} placeholder="Date (YYYY-MM-DD)" className="w-full p-2 border rounded"/>
      <input required value={location} onChange={e=>setLocation(e.target.value)} placeholder="Location" className="w-full p-2 border rounded"/>
      <textarea required value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded"/>
      <input value={skills} onChange={e=>setSkills(e.target.value)} placeholder="Required skills (comma separated)" className="w-full p-2 border rounded"/>
      <button disabled={loading} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        {loading ? "Creating..." : "Create Event"}
      </button>
    </form>
  );
}
