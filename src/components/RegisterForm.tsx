import React, { useState } from "react";
import { registerUser } from "../lib/api";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [github, setGithub] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name, email, skills, experience, github };
      const res = await registerUser(payload);
      console.log("register response:", res);
      alert("Registered: " + res.user_id);
      setName(""); setEmail(""); setSkills(""); setExperience(""); setGithub("");
    } catch (err: any) {
      console.error("register error:", err);
      alert("Error registering — check console");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-md space-y-3">
      <h3 className="text-lg font-semibold">Register</h3>
      <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full p-2 border rounded"/>
      <input required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded"/>
      <input value={skills} onChange={e=>setSkills(e.target.value)} placeholder="Skills (comma separated)" className="w-full p-2 border rounded"/>
      <input value={experience} onChange={e=>setExperience(e.target.value)} placeholder="Experience (optional)" className="w-full p-2 border rounded"/>
      <input value={github} onChange={e=>setGithub(e.target.value)} placeholder="GitHub (optional)" className="w-full p-2 border rounded"/>
      <button disabled={loading} type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
