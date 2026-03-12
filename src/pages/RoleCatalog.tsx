import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, BarChart3, PenTool, TrendingUp } from "lucide-react";

const roles = [
  {
    id: "business-analyst",
    title: "Business Analyst",
    icon: BarChart3,
    skills: ["Requirements analysis", "Process improvement", "Stakeholder management"],
    difficulty: "Intermediate",
    description: "Analyze business requirements, identify process improvements, and communicate with stakeholders.",
  },
  {
    id: "marketing-associate",
    title: "Marketing Associate",
    icon: TrendingUp,
    skills: ["Campaign coordination", "Content creation", "Market research"],
    difficulty: "Beginner",
    description: "Support marketing campaigns, create content, and conduct market research for digital initiatives.",
  },
  {
    id: "operations-assistant",
    title: "Operations Assistant",
    icon: PenTool,
    skills: ["Process management", "Data entry", "Schedule optimization"],
    difficulty: "Beginner",
    description: "Assist with operations tasks, manage scheduling, and optimize workflow processes.",
  },
];

const RoleCatalog = () => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-accent" />
            <span className="text-xl font-bold">Internly</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Sign Out</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">Choose Your Role</h1>
          <p className="text-muted-foreground text-lg">Select an internship simulation to start building real skills</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div key={role.id} className="bg-card border border-border rounded-xl p-6 shadow-card hover:border-primary/50 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                  <role.icon className="w-6 h-6 text-foreground" />
                </div>
                <Badge variant="secondary" className="text-xs">{role.difficulty}</Badge>
              </div>
              <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{role.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {role.skills.map((s) => (
                  <span key={s} className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-md">{s}</span>
                ))}
              </div>
              <Button variant="hero" className="w-full" asChild>
                <Link to={`/simulation/setup/${role.id}`}>Start Simulation</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleCatalog;
