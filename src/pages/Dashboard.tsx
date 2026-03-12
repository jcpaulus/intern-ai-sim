import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Zap, Play, BarChart3, CheckCircle, BookOpen, Trophy, User, History,
  Building2, Clock, Loader2, ArrowRight, ClipboardList, Compass, Briefcase,
  MessageSquare, Circle, ChevronRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProgress, STEPS } from "@/hooks/useProgress";

interface SimulationRun {
  id: string;
  role: string;
  task: string;
  answer: string | null;
  feedback: string | null;
  company: string | null;
  duration_weeks: number | null;
  created_at: string;
}

const companyNames: Record<string, string> = {
  nexora: "Nexora",
  greenleaf: "GreenLeaf Health",
  vividstyle: "VividStyle",
  "atlas-robotics": "Atlas Robotics",
  pulseplay: "PulsePlay",
};

const parseFeedback = (raw: string | null) => {
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
};

const parseTask = (raw: string) => {
  try { return JSON.parse(raw); } catch { return { title: raw }; }
};

interface JourneyStep {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "completed" | "current" | "upcoming";
  link?: string;
  detail?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const { isCompleted, getStep, loading: progressLoading } = useProgress();
  const displayName = profile?.full_name || user?.user_metadata?.full_name || "Student";

  const [runs, setRuns] = useState<SimulationRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchRuns = async () => {
      const { data, error } = await supabase
        .from("simulation_runs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[Dashboard] Error fetching runs:", error);
      } else {
        setRuns((data as SimulationRun[]) || []);
      }
      setLoading(false);
    };
    fetchRuns();
  }, [user]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) { toast.error("Sign out failed: " + error.message); return; }
    toast.success("Signed out successfully");
    navigate("/login");
  };

  // Derive stats
  const totalRuns = runs.length;
  const uniqueRoles = new Set(runs.map(r => r.role)).size;
  const feedbackWithScore = runs.map(r => parseFeedback(r.feedback)).filter(f => f?.score != null);
  const avgScore = feedbackWithScore.length
    ? Math.round(feedbackWithScore.reduce((sum, f) => sum + f.score, 0) / feedbackWithScore.length * 10)
    : null;

  const latestRun = runs[0] ?? null;
  const latestTask = latestRun ? parseTask(latestRun.task) : null;
  const latestFeedback = latestRun ? parseFeedback(latestRun.feedback) : null;

  // --- Build journey steps from persisted progress ---
  const onboardingDone = isCompleted(STEPS.ONBOARDING) || profile?.onboarding_completed === true;
  const roleSelected = isCompleted(STEPS.ROLE_SELECTION) || totalRuns > 0;
  const setupDone = isCompleted(STEPS.SIMULATION_SETUP);
  const orientationDone = isCompleted(STEPS.ORIENTATION);
  const simulationDone = isCompleted(STEPS.SIMULATION) || (latestRun?.answer != null);
  const feedbackDone = isCompleted(STEPS.FEEDBACK) || (latestFeedback != null);

  // Check in-progress states for "Continue" links
  const orientationStep = getStep(STEPS.ORIENTATION);
  const setupStep = getStep(STEPS.SIMULATION_SETUP);

  // Bundled: Onboarding + Role Selection + Configure Simulation = "Get Started"
  const getStartedDone = onboardingDone && roleSelected && setupDone;
  const getStartedLink = !onboardingDone
    ? "/onboarding"
    : !roleSelected
    ? "/roles"
    : !setupDone && setupStep?.metadata?.roleId
    ? `/simulation/setup/${setupStep.metadata.roleId}`
    : !setupDone
    ? "/roles"
    : undefined;

  const getStartedDetail = getStartedDone
    ? "Completed"
    : !onboardingDone
    ? getStep(STEPS.ONBOARDING)?.status === "in_progress" ? "In progress — complete your quiz" : "Start with the onboarding quiz"
    : !roleSelected
    ? "Choose an internship role"
    : !setupDone
    ? setupStep?.status === "in_progress" ? "In progress — finish configuring" : "Configure your simulation"
    : undefined;

  const getStatus = (done: boolean, prevDone: boolean): "completed" | "current" | "upcoming" =>
    done ? "completed" : prevDone ? "current" : "upcoming";

  const journeySteps: JourneyStep[] = [
    {
      id: "get-started",
      label: "Get Started",
      description: "Complete onboarding, choose a role, and configure simulation",
      icon: ClipboardList,
      status: getStatus(getStartedDone, true),
      link: getStartedDone ? getStartedLink : getStartedLink,
      detail: getStartedDetail,
    },
    {
      id: "orientation",
      label: "Day 1 — Orientation",
      description: "Meet your team, review policies, and begin your internship",
      icon: Building2,
      status: getStatus(orientationDone, getStartedDone),
      link: getStartedDone && !orientationDone ? "/simulation/orientation" : undefined,
      detail: orientationDone
        ? "Completed"
        : orientationStep?.status === "in_progress" && orientationStep?.metadata?.completedSections
        ? `${(orientationStep.metadata.completedSections as number[]).length}/2 sections done`
        : undefined,
    },
    {
      id: "simulation",
      label: "My Tasks",
      description: "Work on tasks and submit your deliverables",
      icon: Briefcase,
      status: getStatus(simulationDone, orientationDone),
      link: orientationDone && !simulationDone ? "/simulation/active" : undefined,
      detail: simulationDone ? `${totalRuns} submission${totalRuns !== 1 ? "s" : ""}` : undefined,
    },
    {
      id: "feedback",
      label: "AI Feedback & Score",
      description: "Receive your performance evaluation",
      icon: MessageSquare,
      status: getStatus(feedbackDone, simulationDone),
      detail: feedbackDone && latestFeedback?.score != null
        ? `Latest: ${latestFeedback.score}/10`
        : undefined,
    },
  ];

  const completedCount = journeySteps.filter(s => s.status === "completed").length;
  const overallProgress = Math.round((completedCount / journeySteps.length) * 100);

  const stats = [
    { icon: BookOpen, label: "Simulations", value: totalRuns.toString() },
    { icon: CheckCircle, label: "Roles Tried", value: uniqueRoles.toString() },
    { icon: Trophy, label: "Avg Score", value: avgScore != null ? `${avgScore}%` : "–" },
  ];

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const roleLabel = (role: string) =>
    role.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
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
            <Button variant="ghost" size="sm" onClick={handleSignOut}>Sign Out</Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2 animate-fade-in">Welcome back, {displayName}! 👋</h1>
        <p className="text-muted-foreground mb-10">Here's your internship journey</p>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Overall Progress */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-card mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Your Journey</h2>
                <Badge variant="secondary" className="text-xs">
                  {completedCount}/{journeySteps.length} steps
                </Badge>
              </div>
              <Progress value={overallProgress} className="h-3 mb-2" />
              <p className="text-sm text-muted-foreground">{overallProgress}% complete</p>
            </div>

            {/* Journey Steps */}
            <div className="bg-card border border-border rounded-xl shadow-card mb-10 overflow-hidden">
              {journeySteps.map((step, i) => {
                const Icon = step.icon;
                const isLast = i === journeySteps.length - 1;
                return (
                  <div
                    key={step.id}
                    className={`flex items-start gap-4 p-5 relative transition-colors ${
                      step.status === "current" ? "bg-primary/5" : ""
                    } ${!isLast ? "border-b border-border" : ""}`}
                  >
                    {/* Status icon */}
                    <div className="shrink-0 mt-0.5">
                      {step.status === "completed" ? (
                        <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-accent" />
                        </div>
                      ) : step.status === "current" ? (
                        <div className="w-9 h-9 rounded-full bg-primary/15 border-2 border-primary flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                          <Circle className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-sm ${
                          step.status === "upcoming" ? "text-muted-foreground" : "text-foreground"
                        }`}>
                          {step.label}
                        </span>
                        {step.status === "completed" && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Done</Badge>
                        )}
                        {step.status === "current" && (
                          <Badge className="text-[10px] px-1.5 py-0 bg-primary text-primary-foreground">Current</Badge>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 ${
                        step.status === "upcoming" ? "text-muted-foreground/60" : "text-muted-foreground"
                      }`}>
                        {step.description}
                      </p>
                      {step.detail && (
                        <p className="text-xs text-accent mt-1 font-medium">{step.detail}</p>
                      )}
                    </div>

                    {/* Action */}
                    {step.link && step.status === "completed" && (
                      <Button variant="ghost" size="sm" asChild className="shrink-0 self-center text-muted-foreground">
                        <Link to={step.link}>
                          View <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </Button>
                    )}
                    {step.link && step.status !== "completed" && (
                      <Button variant="outline" size="sm" asChild className="shrink-0 self-center">
                        <Link to={step.link}>
                          Continue <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

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

            {/* Latest Simulation */}
            {latestRun ? (
              <>
                <div className="bg-card border border-border rounded-xl p-6 shadow-card mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-accent font-medium mb-1">Last Simulation</div>
                      <h2 className="text-xl font-semibold">{roleLabel(latestRun.role)}</h2>
                      <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground flex-wrap">
                        {latestRun.company && (
                          <span className="inline-flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {companyNames[latestRun.company] ?? latestRun.company}
                          </span>
                        )}
                        {latestRun.duration_weeks && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {latestRun.duration_weeks} weeks
                          </span>
                        )}
                        <span>{formatDate(latestRun.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {latestFeedback?.score != null && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-accent">{latestFeedback.score}/10</div>
                          <div className="text-xs text-muted-foreground">Score</div>
                        </div>
                      )}
                      <Button variant="hero" asChild>
                        <Link to="/roles"><Play className="w-4 h-4 mr-1" /> New Simulation</Link>
                      </Button>
                    </div>
                  </div>

                  {latestFeedback?.score != null && (
                    <>
                      <Progress value={latestFeedback.score * 10} className="h-2 mb-3" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Performance score</span>
                        <Badge variant={latestFeedback.hiring_decision === "Hire" ? "default" : "secondary"}>
                          {latestFeedback.hiring_decision ?? "Reviewed"}
                        </Badge>
                      </div>
                    </>
                  )}

                  {latestTask?.title && (
                    <div className="mt-4 p-3 bg-secondary/50 rounded-lg text-sm">
                      <span className="text-muted-foreground">Task:</span>{" "}
                      <span className="text-foreground">{latestTask.title}</span>
                    </div>
                  )}
                </div>

                {/* Past Simulations */}
                {runs.length > 1 && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">Past Simulations</h2>
                      {runs.length > 3 && (
                        <Link to="/history" className="text-sm text-accent hover:underline inline-flex items-center gap-1">
                          View all <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                    <div className="space-y-3">
                      {runs.slice(1, 6).map((run) => {
                        const fb = parseFeedback(run.feedback);
                        const t = parseTask(run.task);
                        return (
                          <div key={run.id} className="bg-card border border-border rounded-xl p-5 shadow-card flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-semibold">{roleLabel(run.role)}</span>
                                {run.company && (
                                  <Badge variant="secondary" className="text-xs">
                                    {companyNames[run.company] ?? run.company}
                                  </Badge>
                                )}
                                {run.duration_weeks && (
                                  <Badge variant="outline" className="text-xs">
                                    {run.duration_weeks}w
                                  </Badge>
                                )}
                              </div>
                              {t?.title && <p className="text-sm text-muted-foreground truncate">{t.title}</p>}
                              <p className="text-xs text-muted-foreground mt-1">{formatDate(run.created_at)}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              {fb?.score != null && (
                                <div className="text-right">
                                  <div className="text-lg font-bold text-accent">{fb.score}/10</div>
                                  <div className="text-xs text-muted-foreground">{fb.hiring_decision ?? "–"}</div>
                                </div>
                              )}
                              <Button variant="outline" size="sm" asChild>
                                <Link to="/history">Details</Link>
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="bg-card border border-border rounded-xl p-12 text-center shadow-card">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No simulations yet</h2>
                <p className="text-muted-foreground mb-6">Choose a role and start your first internship simulation.</p>
                <Button variant="hero" asChild>
                  <Link to="/roles">Browse Roles <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;