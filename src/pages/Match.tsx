import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEvents, matchUsers } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

export default function Match() {
  const navigate = useNavigate(); // <-- MUST be inside component
  const [events, setEvents] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState<number | null>(null); // which event is loading

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch((err) => console.error("fetchEvents error:", err));
  }, []);

  async function handleMatch(eventId: number) {
    // require login
    const raw = localStorage.getItem("user");
    if (!raw) {
      navigate("/login");
      return;
    }

    setLoading(eventId);
    try {
      const res = await matchUsers(eventId);
      setTeams(res.teams || []);
    } catch (err: any) {
      console.error("matchUsers failed:", err);
      alert("Error matching users");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">Team Matching</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <Card key={ev.id} className="shadow-md">
              <CardHeader>
                <CardTitle>{ev.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {ev.date} — {ev.location}
                </p>
                <p className="text-sm">{ev.description}</p>
                <Button
                  className="w-full mt-2"
                  onClick={() => handleMatch(ev.id)}
                  disabled={loading === ev.id}
                >
                  {loading === ev.id ? "Matching..." : "Find Teams"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {teams.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Suggested Teams</h2>
            <div className="space-y-4">
              {teams.map((t: any) => (
                <Card key={t.team_id} className="shadow-sm">
                  <CardHeader>
                    <CardTitle>
                      Team {t.team_id} — Score{" "}
                      {t.compatibility_score.toFixed(2)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-6 space-y-1">
                      {t.members.map((m: any, i: number) => (
                        <li key={i}>
                          <span className="font-medium">{m.name}</span> (
                          {m.email}) — {m.skills.join(", ")}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link to="/">
            <Button variant="outline">← Back to Home</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
