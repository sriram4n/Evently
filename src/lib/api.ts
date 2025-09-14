// frontend/src/lib/api.ts
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000"; // local dev backend

export async function createEvent(payload: {
  name: string;
  date: string;
  location: string;
  description: string;
  required_skills: string;
}) {
  const res = await axios.post(`${API_BASE}/create_event`, payload, { headers: { "Content-Type": "application/json" }});
  return res.data;
}

export async function registerUser(payload: {
  name: string;
  email: string;
  skills: string;
  experience?: string;
  github?: string;
}) {
  const res = await axios.post(`${API_BASE}/register`, payload, { headers: { "Content-Type": "application/json" }});
  return res.data;
}

export async function fetchEvents() {
  const res = await axios.get(`${API_BASE}/events`);
  return res.data;
}

export async function fetchUsers() {
  const res = await axios.get(`${API_BASE}/users`);
  return res.data;
}

export async function matchUsers(eventId: number) {
  // backend expects POST /match_users with event_id query param
  const res = await axios.post(`${API_BASE}/match_users?event_id=${eventId}`, {}, { headers: { "Content-Type": "application/json" }});
  return res.data;
}

export async function seedDemo() {
  const res = await axios.post(`${API_BASE}/seed_demo`, {});
  return res.data;
}
