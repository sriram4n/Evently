import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, Users, TrendingUp, Zap } from "lucide-react";
import Header from "@/components/Header";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    activeEvents: 0,
    matchingSuccess: 0,
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      totalEvents: 12,
      totalParticipants: 248,
      activeEvents: 3,
      matchingSuccess: 87,
    });

    setChartData([
      { month: "Jan", events: 2, participants: 45 },
      { month: "Feb", events: 3, participants: 52 },
      { month: "Mar", events: 1, participants: 28 },
      { month: "Apr", events: 4, participants: 68 },
      { month: "May", events: 2, participants: 55 },
    ]);
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            Overview of your events and participant analytics
          </p>
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
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar 
                    dataKey="events" 
                    fill="hsl(var(--primary))" 
                    name="Events"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="participants" 
                    fill="hsl(var(--accent))" 
                    name="Participants"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New event created</p>
                    <p className="text-xs text-muted-foreground">AI Hackathon 2024</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2h ago</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">15 new registrations</p>
                    <p className="text-xs text-muted-foreground">Web3 Workshop</p>
                  </div>
                  <span className="text-xs text-muted-foreground">5h ago</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Team matching completed</p>
                    <p className="text-xs text-muted-foreground">Mobile App Challenge</p>
                  </div>
                  <span className="text-xs text-muted-foreground">1d ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;