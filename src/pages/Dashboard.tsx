import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, Users, TrendingUp, Zap } from "lucide-react";
import Header from "@/components/Header";
import { fetchEvents, fetchUsers, seedDemo } from "@/lib/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    activeEvents: 0,
    matchingSuccess: 0,
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadData() {
    try {
      const events = await fetchEvents();
      const users = await fetchUsers();

      setStats({
        totalEvents: events.length,
        totalParticipants: users.length,
        activeEvents: events.filter((e: any) => new Date(e.date) > new Date()).length,
        matchingSuccess: Math.floor(Math.random() * 100), // fake % for demo
      });

      // Simple monthly chart data from events
      const grouped: Record<string, number> = {};
      events.forEach((e: any) => {
        const month = new Date(e.date).toLocaleString("default", { month: "short" });
        grouped[month] = (grouped[month] || 0) + 1;
      });

      const data = Object.entries(grouped).map(([month, events]) => ({
        month,
        events,
        participants: Math.floor(Math.random() * 50) + 10, // fake participants for demo
      }));

      setChartData(data);
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  }

  async function handleSeed() {
    setLoading(true);
    try {
      await seedDemo();
      await loadData();
      alert("Demo data seeded!");
    } catch (err) {
      console.error("Seed error:", err);
      alert("Error seeding demo data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const statCards = [
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Participants",
      value: stats.totalParticipants,
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Active Events",
      value: stats.activeEvents,
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Matching Success",
      value: `${stats.matchingSuccess}%`,
      icon: Zap,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-xl text-muted-foreground">
              Overview of your events and participant analytics
            </p>
          </div>
          <button
            onClick={handleSeed}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            {loading ? "Seeding..." : "Seed Demo Data"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Events & Participants Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="events" fill="hsl(var(--primary))" name="Events" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="participants" fill="hsl(var(--accent))" name="Participants" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This could be wired to a `/recent_activity` endpoint later.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
