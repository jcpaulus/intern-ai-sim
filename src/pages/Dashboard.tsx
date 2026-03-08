import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Zap, Play, BarChart3, CheckCircle, BookOpen, Trophy, User, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const displayName = profile?.full_name || user?.user_metadata?.full_name || "Student";

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Gagal sign out: " + error.message);
      return;
    }
    toast.success("Berhasil sign out");
    navigate("/login");
  };

  const activeSimulation = {
    role: "Marketing Analyst",
    progress: 40,
    tasksCompleted: 2,
    totalTasks: 5,
    nextTask: "Create a social media content calendar",
    daysRemaining: 5,
  };

  const pastSimulations = [
    { role: "UI/UX Designer", score: 82, date: "Feb 2026", status: "Completed" },
  ];

  const stats = [
    { icon: BookOpen, label: "Simulations", value: "2" },
    { icon: CheckCircle, label: "Skills Practiced", value: "8" },
    { icon: Trophy, label: "Reports Generated", value: "1" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-accent" />
            <span className="text-xl font-bold">Internly</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/roles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Roles</Link>
            <Link to="/history" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
              <History className="w-4 h-4" /> History
            </Link>
            <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
              <User className="w-5 h-5" />
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2 animate-fade-in">Welcome back, {displayName}! 👋</h1>
        <p className="text-muted-foreground mb-10">Here's your internship progress</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-5 shadow-card text-center">
              <s.icon className="w-6 h-6 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Active Simulation */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-card mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-accent font-medium mb-1">Active Simulation</div>
              <h2 className="text-xl font-semibold">{activeSimulation.role}</h2>
            </div>
            <Button variant="hero" asChild>
              <Link to="/simulation/active"><Play className="w-4 h-4 mr-1" /> Continue</Link>
            </Button>
          </div>
          <Progress value={activeSimulation.progress} className="h-2 mb-3" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{activeSimulation.tasksCompleted}/{activeSimulation.totalTasks} tasks completed</span>
            <span>{activeSimulation.daysRemaining} days remaining</span>
          </div>
          <div className="mt-4 p-3 bg-secondary/50 rounded-lg text-sm">
            <span className="text-muted-foreground">Next task:</span>{" "}
            <span className="text-foreground">{activeSimulation.nextTask}</span>
          </div>
        </div>

        {/* Past Simulations */}
        <h2 className="text-xl font-semibold mb-4">Past Simulations</h2>
        <div className="space-y-3">
          {pastSimulations.map((sim) => (
            <div key={sim.role} className="bg-card border border-border rounded-xl p-5 shadow-card flex items-center justify-between">
              <div>
                <div className="font-semibold">{sim.role}</div>
                <div className="text-sm text-muted-foreground">{sim.date}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-accent">{sim.score}/100</div>
                  <div className="text-xs text-muted-foreground">{sim.status}</div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/report">View Report</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
