import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, BarChart3, PenTool, TrendingUp, Clock, Filter } from "lucide-react";

const roles = [
  {
    id: "marketing-analyst",
    title: "Marketing Analyst",
    icon: TrendingUp,
    skills: ["Campaign planning", "Copywriting", "Data reporting"],
    duration: "2–12 weeks",
    difficulty: "Beginner",
    description: "Plan campaigns, write copy, and analyze marketing data for a fictional brand.",
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    icon: BarChart3,
    skills: ["Data interpretation", "Visualization", "Reporting"],
    duration: "2–12 weeks",
    difficulty: "Intermediate",
    description: "Analyze datasets, create visualizations, and present insights to stakeholders.",
  },
  {
    id: "ui-ux-designer",
    title: "UI/UX Designer",
    icon: PenTool,
    skills: ["User research", "Wireframing", "Design critique"],
    duration: "2–12 weeks",
    difficulty: "Beginner",
    description: "Conduct user research, create wireframes, and iterate on design feedback.",
  },
];

const filters = ["All", "1 Week", "2 Weeks", "4 Weeks"];

const RoleCatalog = () => {
  const [activeFilter, setActiveFilter] = useState("All");

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

        <div className="flex items-center gap-2 mb-8">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                activeFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
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
              <div className="flex flex-wrap gap-2 mb-4">
                {role.skills.map((s) => (
                  <span key={s} className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-md">{s}</span>
                ))}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
                <Clock className="w-4 h-4" /> {role.duration}
              </div>
              <div className="flex gap-3">
                <Button variant="hero" className="flex-1" asChild>
                  <Link to={`/simulation/setup/${role.id}`}>Start Simulation</Link>
                </Button>
                <Button variant="outline" size="sm">Preview</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleCatalog;
