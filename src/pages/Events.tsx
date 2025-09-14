import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  description: string;
  requiredSkills: string[];
  participantCount: number;
  status: "upcoming" | "ongoing" | "completed";
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<"all" | "upcoming" | "ongoing" | "completed">("all");

  useEffect(() => {
    // Mock data - replace with actual API call
    setEvents([
      {
        id: 1,
        name: "AI Hackathon 2024",
        date: "2024-01-15T09:00:00",
        location: "San Francisco, CA",
        description: "Build the next generation of AI applications with cutting-edge tools and technologies.",
        requiredSkills: ["Python", "Machine Learning", "TensorFlow", "React"],
        participantCount: 45,
        status: "upcoming"
      },
      {
        id: 2,
        name: "Web3 Developer Workshop",
        date: "2024-01-08T10:00:00",
        location: "Austin, TX",
        description: "Learn blockchain development and build decentralized applications.",
        requiredSkills: ["Solidity", "JavaScript", "Web3.js", "Smart Contracts"],
        participantCount: 32,
        status: "ongoing"
      },
      {
        id: 3,
        name: "Mobile App Challenge",
        date: "2023-12-20T09:00:00",
        location: "Seattle, WA",
        description: "Create innovative mobile applications for iOS and Android platforms.",
        requiredSkills: ["React Native", "Flutter", "iOS", "Android"],
        participantCount: 28,
        status: "completed"
      },
      {
        id: 4,
        name: "Sustainability Tech Jam",
        date: "2024-02-01T09:00:00",
        location: "Portland, OR",
        description: "Develop technology solutions for environmental sustainability challenges.",
        requiredSkills: ["IoT", "Data Science", "Clean Tech", "Python"],
        participantCount: 38,
        status: "upcoming"
      },
      {
        id: 5,
        name: "Fintech Innovation Summit",
        date: "2024-01-25T09:00:00",
        location: "New York, NY",
        description: "Build the future of financial technology with modern tools and APIs.",
        requiredSkills: ["Node.js", "React", "APIs", "Security"],
        participantCount: 52,
        status: "upcoming"
      }
    ]);
  }, []);

  const filteredEvents = events.filter(event => 
    filter === "all" || event.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-500/10 text-blue-600";
      case "ongoing": return "bg-green-500/10 text-green-600";
      case "completed": return "bg-gray-500/10 text-gray-600";
      default: return "bg-gray-500/10 text-gray-600";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Events</h1>
            <p className="text-xl text-muted-foreground">
              Discover hackathons and tech events near you
            </p>
          </div>
          <Button asChild>
            <Link to="/create">Create Event</Link>
          </Button>
        </div>

        <div className="flex space-x-2 mb-6">
          {["all", "upcoming", "ongoing", "completed"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status as any)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl line-clamp-2">{event.name}</CardTitle>
                  <Badge className={`capitalize ${getStatusColor(event.status)}`}>
                    {event.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{event.participantCount} participants</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {event.description}
                </p>
                
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {event.requiredSkills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {event.requiredSkills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{event.requiredSkills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  {event.status === "upcoming" && (
                    <Button size="sm" className="flex-1" asChild>
                      <Link to="/register">Join Event</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground">
              No events match your current filter. Try adjusting your selection.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Events;