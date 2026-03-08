import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowLeft, Loader2, Clock, Briefcase, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface SimulationRun {
  id: string;
  role: string;
  task: string;
  answer: string | null;
  feedback: string;
  created_at: string;
}

const SimulationHistory = () => {
  const { user } = useAuth();
  const [runs, setRuns] = useState<SimulationRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchRuns = async () => {
      const { data, error } = await supabase
        .from("simulation_runs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[History] Error fetching runs:", error);
      } else {
        setRuns(data || []);
      }
      setLoading(false);
    };
    fetchRuns();
  }, [user]);

  const parseFeedback = (feedback: string) => {
    try {
      return JSON.parse(feedback);
    } catch {
      return null;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Dashboard</span>
          </Link>
          <div className="flex items-center gap-2 ml-auto">
            <Zap className="w-5 h-5 text-accent" />
            <span className="font-semibold">Internly</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Simulation History</h1>
          <p className="text-muted-foreground">Review your past simulation runs and feedback</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : runs.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center shadow-card">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No simulations yet</h2>
            <p className="text-muted-foreground mb-6">Complete your first internship simulation to see results here.</p>
            <Link to="/internship-simulation">
              <Button variant="hero">Start a Simulation</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {runs.map((run) => {
              const parsed = parseFeedback(run.feedback);
              const score = parsed?.score;
              const isExpanded = expandedId === run.id;

              return (
                <div
                  key={run.id}
                  className="bg-card border border-border rounded-xl shadow-card overflow-hidden transition-all"
                >
                  {/* Header row */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : run.id)}
                    className="w-full text-left p-5 flex items-center gap-4 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="shrink-0">{run.role}</Badge>
                        {score != null && (
                          <Badge
                            variant={score >= 7 ? "default" : score >= 4 ? "secondary" : "destructive"}
                            className="shrink-0"
                          >
                            {score}/10
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{run.task}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-muted-foreground hidden sm:inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(run.created_at)}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="border-t border-border p-5 space-y-4 animate-fade-in">
                      {/* Task */}
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Task</h4>
                        <p className="text-sm">{run.task}</p>
                      </div>

                      {/* Answer */}
                      {run.answer && (
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Your Answer</h4>
                          <p className="text-sm whitespace-pre-wrap bg-secondary/30 rounded-lg p-3">{run.answer}</p>
                        </div>
                      )}

                      {/* Feedback */}
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> Feedback
                        </h4>
                        {parsed ? (
                          <div className="space-y-3">
                            {parsed.strengths && (
                              <div>
                                <p className="text-xs font-medium text-primary mb-1">Strengths</p>
                                <p className="text-sm">{parsed.strengths}</p>
                              </div>
                            )}
                            {parsed.areas_for_improvement && (
                              <div>
                                <p className="text-xs font-medium text-destructive mb-1">Areas for Improvement</p>
                                <p className="text-sm">{parsed.areas_for_improvement}</p>
                              </div>
                            )}
                            {parsed.recommendation && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">Recommendation</p>
                                <p className="text-sm">{parsed.recommendation}</p>
                              </div>
                            )}
                            {parsed.hiring_decision && (
                              <Badge variant="outline" className="mt-1">{parsed.hiring_decision}</Badge>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap bg-secondary/30 rounded-lg p-3">{run.feedback}</p>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground flex items-center gap-1 sm:hidden">
                        <Clock className="w-3 h-3" />
                        {formatDate(run.created_at)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationHistory;
