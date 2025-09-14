import { useState } from "react";
import { registerUser } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [github, setGithub] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Basic client-side validation
    if (!username || !password) {
      alert("Please provide a username and password.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name,
        email,
        username,
        password,
        skills,
        experience,
        github,
      };
      const res = await registerUser(payload);
      alert("✅ Registered: " + res.user_id);
      // Clear form
      setName("");
      setEmail("");
      setUsername("");
      setPassword("");
      setSkills("");
      setExperience("");
      setGithub("");
      // Redirect to login so user can log in
      navigate("/login");
    } catch (err: any) {
      console.error("registerUser failed:", err);
      const msg = err?.response?.data?.detail || err?.message || "Error registering user";
      alert("❌ " + msg);
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
            <CardTitle>Register Participant</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div>
                <Label>Username</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="choose-a-handle" />
              </div>

              <div>
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="make it strong" />
              </div>

              <div>
                <Label>Skills</Label>
                <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Python, React" />
              </div>

              <div>
                <Label>Experience</Label>
                <Input value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="3 years frontend" />
              </div>

              <div>
                <Label>GitHub</Label>
                <Input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/you" />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Registering..." : "Register"}
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
