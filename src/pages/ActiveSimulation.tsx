import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Zap, CheckCircle, Clock, AlertCircle, ChevronRight, ChevronLeft,
  CalendarDays, Lock, Trophy, FileText, ChevronDown, ChevronUp,
  Upload, X, Send, Loader2, Star, Target, TrendingUp, ThumbsUp, ThumbsDown,
  ExternalLink, BookOpen, Info, Database, Wrench, Layout, Lightbulb,
} from "lucide-react";
import { useProgress, STEPS } from "@/hooks/useProgress";
import { generateSchedule, type WeekSchedule, type DailyTask, type EvaluationCriterion, type TaskResource } from "@/data/schedule";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ── Helpers ──

interface TaskItem {
  id: string;
  weekNum: number;
  dayNum?: number;
  title: string;
  deliverable?: string;
  deadline?: string;
  isGroupTask: boolean;
  evaluationCriteria?: EvaluationCriterion[];
}

function buildTaskList(schedule: WeekSchedule[]): TaskItem[] {
  const tasks: TaskItem[] = [];
  for (const week of schedule) {
    if (week.dailyTasks && week.dailyTasks.length > 0) {
      for (const dt of week.dailyTasks) {
        tasks.push({
          id: `w${week.week}-d${dt.day}`,
          weekNum: week.week,
          dayNum: dt.day,
          title: dt.title,
          deliverable: dt.deliverable,
          deadline: dt.deadline,
          isGroupTask: false,
          evaluationCriteria: dt.evaluationCriteria,
        });
      }
    } else {
      week.items.forEach((item, idx) => {
        const isGroup = item.startsWith("📋");
        tasks.push({
          id: `w${week.week}-i${idx}`,
          weekNum: week.week,
          dayNum: undefined,
          title: isGroup ? item.replace("📋 Group Task: ", "") : item,
          deliverable: undefined,
          deadline: `End of Week ${week.week}`,
          isGroupTask: isGroup,
        });
      });
    }
  }
  return tasks;
}

function getCurrentWeek(orientationCompletedAt?: string, totalWeeks?: number): number {
  if (!orientationCompletedAt) return 1;
  const start = new Date(orientationCompletedAt);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;
  return Math.min(Math.max(diffWeeks, 1), totalWeeks || 12);
}

const ActiveSimulation = () => {
  const { saveProgress, getStep, loading: progressLoading } = useProgress();

  const savedOrientation = getStep(STEPS.ORIENTATION);
  const savedSimulation = getStep(STEPS.SIMULATION);
  const simState = savedOrientation?.metadata?.simState as {
    roleId?: string;
    roleTitle?: string;
    company?: { id: string; name: string; industry: string; size: string; description: string; culture: string };
    duration?: string;
    level?: string;
    managerStyle?: string;
  } | undefined;

  const roleId = simState?.roleId || "marketing-associate";
  const roleTitle = simState?.roleTitle || "Marketing Associate";
  const company = simState?.company || {
    id: "brightwave", name: "BrightWave Marketing",
    industry: "Media/Advertising", size: "200 employees",
    description: "A creative marketing agency.", culture: "Creative, data-driven",
  };
  const durationWeeks = simState?.duration ? parseInt(simState.duration) : 2;

  const schedule = useMemo(
    () => generateSchedule(durationWeeks, roleTitle, roleId, company.id),
    [durationWeeks, roleTitle, roleId, company.id]
  );
  const allTasks = useMemo(() => buildTaskList(schedule), [schedule]);

  const orientationCompletedAt = savedOrientation?.status === "completed" ? savedOrientation.updated_at : undefined;
  const currentWeek = getCurrentWeek(orientationCompletedAt, durationWeeks);

  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([currentWeek]));
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);
  const [activePanel, setActivePanel] = useState<"resources" | "tips" | "criteria" | null>(null);

  // Restore completed tasks
  useEffect(() => {
    if (progressLoading || initialized) return;
    const saved = savedSimulation?.metadata?.completedTasks;
    if (Array.isArray(saved)) {
      setCompletedTasks(new Set(saved));
    }
    setInitialized(true);
  }, [progressLoading, initialized, savedSimulation]);

  // Set initial active task to first incomplete task of current week
  useEffect(() => {
    if (!initialized || activeTaskId) return;
    const currentWeekTasks = allTasks.filter((t) => t.weekNum === currentWeek);
    const firstIncomplete = currentWeekTasks.find((t) => !completedTasks.has(t.id));
    if (firstIncomplete) {
      setActiveTaskId(firstIncomplete.id);
    } else if (currentWeekTasks.length > 0) {
      setActiveTaskId(currentWeekTasks[0].id);
    }
  }, [initialized, currentWeek, allTasks, completedTasks, activeTaskId]);

  // Auto-close overdue tasks
  useEffect(() => {
    if (!initialized) return;
    const overdueTasks = allTasks.filter(
      (t) => t.weekNum < currentWeek && !completedTasks.has(t.id)
    );
    if (overdueTasks.length > 0) {
      setCompletedTasks((prev) => {
        const next = new Set(prev);
        for (const t of overdueTasks) next.add(t.id);
        return next;
      });
    }
  }, [initialized, currentWeek, allTasks]);

  const persistTasks = useCallback(
    (tasks: Set<string>) => {
      saveProgress(STEPS.SIMULATION, "in_progress", {
        roleId,
        companyId: company.id,
        completedTasks: Array.from(tasks),
        currentWeek,
      });
    },
    [saveProgress, roleId, company.id, currentWeek]
  );

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      const isUncompleting = next.has(taskId);
      if (isUncompleting) next.delete(taskId);
      else next.add(taskId);
      persistTasks(next);

      // If marking incomplete, clear feedback so user can re-submit
      if (isUncompleting) {
        setFeedback((prevFb) => {
          const updated = { ...prevFb };
          delete updated[taskId];
          // Persist cleared feedback
          saveProgress(STEPS.SIMULATION, "in_progress", {
            roleId,
            companyId: company.id,
            completedTasks: Array.from(next),
            currentWeek,
            feedback: updated,
          });
          return updated;
        });
        setSubmissionText("");
        setSubmissionFile(null);
      }
      return next;
    });
  };

  const toggleWeekExpand = (weekNum: number) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekNum)) next.delete(weekNum);
      else next.add(weekNum);
      return next;
    });
  };

  // Active task details
  const activeTask = allTasks.find((t) => t.id === activeTaskId);
  const activeWeekSchedule = activeTask ? schedule.find((w) => w.week === activeTask.weekNum) : null;
  const activeDailyTask = activeWeekSchedule?.dailyTasks?.find((dt) => dt.day === activeTask?.dayNum);
  const isActiveTaskDone = activeTask ? completedTasks.has(activeTask.id) : false;
  const isActiveWeekFuture = activeTask ? activeTask.weekNum > currentWeek : false;
  const isActiveTaskDeadlinePassed = activeTask ? activeTask.weekNum < currentWeek : false;

  // Reset panel when task changes
  useEffect(() => {
    setActivePanel(null);
  }, [activeTaskId]);

  // Submission state
  const [submissionText, setSubmissionText] = useState("");
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, any>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restore persisted feedback from progress metadata
  useEffect(() => {
    if (progressLoading || !initialized) return;
    const savedFeedback = savedSimulation?.metadata?.feedback;
    if (savedFeedback && typeof savedFeedback === "object") {
      setFeedback(savedFeedback);
    }
  }, [progressLoading, initialized, savedSimulation]);

  // Check if active task already has feedback (read-only mode)
  const activeTaskHasFeedback = activeTask ? !!feedback[activeTask.id] : false;

const ALLOWED_EXTENSIONS = [".pdf", ".txt", ".docx"];
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  // Dynamic word limit based on task nature
  const getWordLimit = (task: TaskItem, dailyTask?: DailyTask): number => {
    const title = (task.title + " " + (dailyTask?.deliverable || task.deliverable || "")).toLowerCase();
    // Short-form tasks
    if (title.includes("email") || title.includes("memo") || title.includes("summary") || title.includes("brief")) return 300;
    // Medium tasks
    if (title.includes("post") || title.includes("caption") || title.includes("outline") || title.includes("checklist") || title.includes("list")) return 400;
    // Analytical / research tasks
    if (title.includes("report") || title.includes("analysis") || title.includes("audit") || title.includes("review") || title.includes("research")) return 800;
    // Strategy / plan / proposal
    if (title.includes("strategy") || title.includes("plan") || title.includes("proposal") || title.includes("campaign") || title.includes("presentation")) return 1000;
    // Default
    return 500;
  };

  const activeWordLimit = activeTask ? getWordLimit(activeTask, activeDailyTask) : 500;
  const currentWordCount = submissionText.trim() ? submissionText.trim().split(/\s+/).length : 0;
  const isOverLimit = currentWordCount > activeWordLimit;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      toast.error(`Unsupported file type. Use: ${ALLOWED_EXTENSIONS.join(", ")}`);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large. Maximum 10MB.");
      return;
    }
    setSubmissionFile(file);
  };

  const readFileAsText = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "txt") {
      return await file.text();
    }
    // For PDF/DOCX, send as base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        resolve(`[File:${ext}:${file.name}]\n${base64}`);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmitForEvaluation = async () => {
    if (!activeTask) return;
    if (!submissionText.trim() && !submissionFile) {
      toast.error("Please enter text or upload a file to submit.");
      return;
    }

    setIsEvaluating(true);
    try {
      let fileContent: string | undefined;
      let fileName: string | undefined;
      if (submissionFile) {
        fileContent = await readFileAsText(submissionFile);
        fileName = submissionFile.name;
      }

      // Build task brief from deliverable details
      const taskBrief = activeDailyTask
        ? [
            activeDailyTask.deliverable && `Deliverable: ${activeDailyTask.deliverable}`,
            activeDailyTask.campaignGoal && `Goal: ${activeDailyTask.campaignGoal}`,
            activeDailyTask.deliverableDetails?.map((d, i) => `${i + 1}. ${d}`).join("\n"),
          ].filter(Boolean).join("\n\n")
        : activeTask.deliverable || activeTask.title;

      const { data, error } = await supabase.functions.invoke("evaluate-submission", {
        body: {
          submission: submissionText,
          taskTitle: activeTask.title,
          taskBrief,
          fileContent,
          fileName,
          evaluationCriteria: activeTask.evaluationCriteria,
        },
      });

      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }

      const updatedFeedback = { ...feedback, [activeTask.id]: data.feedback };
      setFeedback(updatedFeedback);
      toast.success("Submission evaluated!");

      // Persist feedback to progress metadata
      saveProgress(STEPS.SIMULATION, "in_progress", {
        roleId,
        companyId: company.id,
        completedTasks: Array.from(completedTasks),
        currentWeek,
        feedback: updatedFeedback,
      });

      // Auto-mark as complete
      if (!completedTasks.has(activeTask.id)) {
        toggleTask(activeTask.id);
      }
    } catch (err: any) {
      console.error("Evaluation error:", err);
      toast.error(err.message || "Failed to evaluate submission. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // Overall progress
  const totalCompleted = allTasks.filter((t) => completedTasks.has(t.id)).length;
  const overallProgress = allTasks.length > 0 ? (totalCompleted / allTasks.length) * 100 : 0;

  // Check if all tasks done
  useEffect(() => {
    if (!initialized) return;
    if (allTasks.length > 0 && totalCompleted === allTasks.length) {
      saveProgress(STEPS.SIMULATION, "completed", {
        roleId,
        companyId: company.id,
        completedTasks: Array.from(completedTasks),
      });
    }
  }, [totalCompleted, allTasks.length, initialized]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-full mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              <span className="font-bold">Internly</span>
            </Link>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <span>{roleTitle}</span>
              <span>•</span>
              <span>{company.name}</span>
              <span>•</span>
              <span>Week {currentWeek}/{durationWeeks}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{totalCompleted}/{allTasks.length} tasks</span>
              <Progress value={overallProgress} className="w-32 h-2" />
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard">Exit</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — Weekly Schedule with nested tasks */}
        <aside className="hidden md:flex w-80 border-r border-border bg-card flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-sm">Weekly Schedule</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{durationWeeks}-week internship</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {schedule.map((week) => {
              const wTasks = allTasks.filter((t) => t.weekNum === week.week);
              const wDone = wTasks.filter((t) => completedTasks.has(t.id)).length;
              const allDone = wDone === wTasks.length && wTasks.length > 0;
              const isCurrentWeek = week.week === currentWeek;
              const isLocked = week.week > currentWeek;
              const isExpanded = expandedWeeks.has(week.week);

              return (
                <div key={week.week}>
                  {/* Week header */}
                  <button
                    onClick={() => {
                      if (!isLocked) toggleWeekExpand(week.week);
                    }}
                    disabled={isLocked}
                    className={`w-full flex items-center gap-2 p-2.5 rounded-lg text-left text-sm transition-colors ${
                      isLocked
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-secondary"
                    }`}
                  >
                    {allDone ? (
                      <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                    ) : isCurrentWeek ? (
                      <AlertCircle className="w-4 h-4 text-primary shrink-0" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium truncate text-xs ${isLocked ? "text-muted-foreground" : "text-foreground"}`}>
                        Week {week.week} — {week.title}
                      </div>
                    </div>
                    <Badge variant={allDone ? "default" : "secondary"} className="text-[10px] shrink-0">
                      {wDone}/{wTasks.length}
                    </Badge>
                    {!isLocked && (
                      isExpanded
                        ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  {/* Nested daily tasks */}
                  {isExpanded && !isLocked && (
                    <div className="ml-4 pl-3 border-l-2 border-border space-y-0.5 py-1">
                      {wTasks.map((task) => {
                        const isDone = completedTasks.has(task.id);
                        const isActive = task.id === activeTaskId;
                        return (
                          <button
                            key={task.id}
                            onClick={() => setActiveTaskId(task.id)}
                            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-left text-xs transition-colors ${
                              isActive
                                ? "bg-primary/10 border border-primary/30 text-foreground"
                                : "hover:bg-secondary text-muted-foreground"
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle className="w-3.5 h-3.5 text-accent shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border-2 border-muted-foreground/40 shrink-0" />
                            )}
                            <span className={`flex-1 truncate ${isDone ? "line-through opacity-60" : ""}`}>
                              {task.dayNum ? `Day ${task.dayNum}: ` : ""}{task.title}
                            </span>
                            {task.isGroupTask && (
                              <Badge variant="secondary" className="text-[9px] shrink-0">Group</Badge>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Content — Active Task */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-4xl mx-auto w-full">
          {activeTask && activeWeekSchedule ? (
            <div className="animate-fade-in">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <span>Week {activeTask.weekNum}</span>
                <ChevronRight className="w-3 h-3" />
                <span>{activeWeekSchedule.title}</span>
                {activeTask.dayNum && (
                  <>
                    <ChevronRight className="w-3 h-3" />
                    <span>Day {activeTask.dayNum}</span>
                  </>
                )}
              </div>

              {/* Task Title & Status */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground">{activeTask.title}</h1>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {activeTask.isGroupTask && (
                      <Badge variant="secondary">Group Task</Badge>
                    )}
                    <Badge variant="outline" className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {activeWeekSchedule.assignedRole}
                    </Badge>
                    {activeTask.deadline && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activeTask.deadline}
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0">
                  {isActiveWeekFuture ? (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </Badge>
                  ) : isActiveTaskDone ? (
                    <Badge className="bg-accent/20 text-accent border-accent/30 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Completed
                    </Badge>
                  ) : (
                    <Badge variant="default" className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> In Progress
                    </Badge>
                  )}
                </div>
              </div>

              {/* Quick Access Icon Toolbar */}
              {(() => {
                const hasResources = activeDailyTask?.resources && activeDailyTask.resources.length > 0;
                const hasTips = activeDailyTask?.exampleData && activeDailyTask.exampleData.length > 0;
                const hasCriteria = activeTask.evaluationCriteria && activeTask.evaluationCriteria.length > 0;
                if (!hasResources && !hasTips && !hasCriteria) return null;
                return (
                  <div className="flex items-center gap-2 mb-6">
                    {hasResources && (
                      <button
                        onClick={() => setActivePanel(activePanel === "resources" ? null : "resources")}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                          activePanel === "resources"
                            ? "bg-primary/10 border-primary/30 text-primary shadow-sm"
                            : "bg-card border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`}
                      >
                        <Wrench className="w-4 h-4" />
                        <span className="hidden sm:inline">Resources</span>
                      </button>
                    )}
                    {hasTips && (
                      <button
                        onClick={() => setActivePanel(activePanel === "tips" ? null : "tips")}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                          activePanel === "tips"
                            ? "bg-accent/10 border-accent/30 text-accent shadow-sm"
                            : "bg-card border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`}
                      >
                        <Lightbulb className="w-4 h-4" />
                        <span className="hidden sm:inline">Tips</span>
                      </button>
                    )}
                    {hasCriteria && (
                      <button
                        onClick={() => setActivePanel(activePanel === "criteria" ? null : "criteria")}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                          activePanel === "criteria"
                            ? "bg-primary/10 border-primary/30 text-primary shadow-sm"
                            : "bg-card border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`}
                      >
                        <Target className="w-4 h-4" />
                        <span className="hidden sm:inline">Criteria</span>
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Panel Content */}
              {activePanel === "resources" && activeDailyTask?.resources && activeDailyTask.resources.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-5 mb-6 animate-fade-in">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Resources & Tools
                  </h3>
                  <div className="space-y-2">
                    {activeDailyTask.resources.map((resource, i) => {
                      const iconMap: Record<string, React.ReactNode> = {
                        tool: <Wrench className="w-3.5 h-3.5 text-accent shrink-0" />,
                        reference: <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />,
                        template: <Layout className="w-3.5 h-3.5 text-primary shrink-0" />,
                        example: <Lightbulb className="w-3.5 h-3.5 text-accent shrink-0" />,
                        data: <Database className="w-3.5 h-3.5 text-primary shrink-0" />,
                      };
                      return (
                        <a
                          key={i}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors group"
                        >
                          {iconMap[resource.type] || <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{resource.label}</span>
                              <Badge variant="secondary" className="text-[9px] capitalize shrink-0">{resource.type}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{resource.description}</p>
                          </div>
                          <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {activePanel === "tips" && activeDailyTask?.exampleData && activeDailyTask.exampleData.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-5 mb-6 animate-fade-in">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-accent" />
                    Reference Data & Tips
                  </h3>
                  <ul className="space-y-2">
                    {activeDailyTask.exampleData.map((data, i) => (
                      <li key={i} className="text-xs text-muted-foreground bg-secondary/20 rounded-lg p-3">
                        {data}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activePanel === "criteria" && activeTask.evaluationCriteria && activeTask.evaluationCriteria.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-5 mb-6 animate-fade-in">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-primary" />
                    Evaluation Criteria
                  </h3>
                  <div className="space-y-2">
                    {activeTask.evaluationCriteria.map((criterion, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex gap-0.5 mt-0.5 shrink-0">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${s < criterion.weight ? "text-primary fill-primary" : "text-muted-foreground/30"}`}
                            />
                          ))}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{criterion.name}</p>
                          <p className="text-xs text-muted-foreground">{criterion.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Deliverable */}
              {activeTask.deliverable && (
                <div className="bg-card border border-border rounded-xl p-4 mb-6">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Deliverable
                  </h3>
                  <p className="text-sm text-muted-foreground">{activeTask.deliverable}</p>
                </div>
              )}

              {/* Daily Task Details */}
              {activeDailyTask && (
                <div className="bg-card border border-border rounded-xl p-5 mb-6 space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Task Details</h3>

                  {activeDailyTask.client && (
                    <div>
                      <p className="text-xs font-semibold text-foreground">Client</p>
                      <p className="text-sm text-muted-foreground">
                        {activeDailyTask.client}
                        {activeDailyTask.clientIndustry && ` — ${activeDailyTask.clientIndustry}`}
                      </p>
                      {activeDailyTask.clientProducts && (
                        <p className="text-xs text-muted-foreground mt-0.5">Products: {activeDailyTask.clientProducts}</p>
                      )}
                    </div>
                  )}

                  {activeDailyTask.campaignGoal && (
                    <div>
                      <p className="text-xs font-semibold text-foreground">Campaign Goal</p>
                      <p className="text-sm text-muted-foreground">{activeDailyTask.campaignGoal}</p>
                    </div>
                  )}

                  {activeDailyTask.targetAudience && (
                    <div>
                      <p className="text-xs font-semibold text-foreground">Target Audience</p>
                      <p className="text-sm text-muted-foreground">{activeDailyTask.targetAudience}</p>
                    </div>
                  )}

                  {activeDailyTask.platforms && activeDailyTask.platforms.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-foreground">Platforms</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {activeDailyTask.platforms.map((p, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{p}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeDailyTask.analysisAreas && activeDailyTask.analysisAreas.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-foreground">Analysis Areas</p>
                      <ul className="text-sm text-muted-foreground list-disc list-inside mt-1 space-y-0.5">
                        {activeDailyTask.analysisAreas.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeDailyTask.identifyItems && activeDailyTask.identifyItems.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-foreground">Key Items to Identify</p>
                      <ul className="text-sm text-muted-foreground list-disc list-inside mt-1 space-y-0.5">
                        {activeDailyTask.identifyItems.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeDailyTask.deliverableDetails && activeDailyTask.deliverableDetails.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-foreground">Requirements</p>
                      <ul className="text-sm text-muted-foreground list-disc list-inside mt-1 space-y-0.5">
                        {activeDailyTask.deliverableDetails.map((detail, i) => (
                          <li key={i}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeDailyTask.note && (
                    <div className="bg-secondary/30 rounded-lg p-3 text-sm text-muted-foreground italic">
                      💡 {activeDailyTask.note}
                    </div>
                  )}
                </div>
              )}

              {/* Background Info */}
              {activeDailyTask?.backgroundInfo && (
                <div className="bg-card border border-border rounded-xl p-5 mb-6">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-primary" />
                    Background Context
                  </h3>
                  <p className="text-sm text-muted-foreground">{activeDailyTask.backgroundInfo}</p>
                </div>
              )}





              {/* Submission Input */}
              {!isActiveWeekFuture && !activeTaskHasFeedback && (
                <div className="bg-card border border-border rounded-xl p-5 mb-6">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Send className="w-4 h-4 text-primary" />
                    Submit Your Deliverable
                  </h3>
                  <Textarea
                    placeholder="Type your submission here..."
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    className={`min-h-[120px] mb-1 ${isOverLimit ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    disabled={isEvaluating}
                  />
                  <div className="flex justify-between items-center mb-3">
                    <p className={`text-xs ${isOverLimit ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                      {currentWordCount}/{activeWordLimit} words
                    </p>
                    {isOverLimit && (
                      <p className="text-xs text-destructive">Exceeds word limit — please shorten your response</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept=".pdf,.txt,.docx"
                      className="hidden"
                    />
                    {submissionFile ? (
                      <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-1.5 text-sm">
                        <FileText className="w-3.5 h-3.5 text-primary" />
                        <span className="truncate max-w-[200px]">{submissionFile.name}</span>
                        <button onClick={() => setSubmissionFile(null)} className="text-muted-foreground hover:text-foreground">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isEvaluating}
                      >
                        <Upload className="w-3.5 h-3.5 mr-1" /> Attach File
                      </Button>
                    )}
                    <Button
                      onClick={handleSubmitForEvaluation}
                      disabled={isEvaluating || isOverLimit || (!submissionText.trim() && !submissionFile)}
                      className="ml-auto"
                    >
                      {isEvaluating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Evaluating...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-1" /> Submit for Evaluation
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Supports text input and PDF/TXT/DOCX uploads (max 10MB)</p>
                </div>
              )}

              {/* Already evaluated notice */}
              {activeTaskHasFeedback && (
                <div className="bg-secondary/30 border border-border rounded-xl p-4 mb-6 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent shrink-0" />
                  <p className="text-sm text-muted-foreground">This task has been evaluated. Your feedback is shown below.</p>
                </div>
              )}

              {/* Feedback Display */}
              {feedback[activeTask.id] && (
                <div className="bg-card border border-border rounded-xl p-5 mb-6 animate-fade-in">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Manager Feedback — Sarah Martinez
                  </h3>

                  {/* Manager's Personal Feedback */}
                  {feedback[activeTask.id].manager_feedback && (
                    <div className="bg-secondary/20 rounded-lg p-4 mb-4 border-l-4 border-primary">
                      <p className="text-xs font-semibold text-foreground mb-2">From your manager:</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{feedback[activeTask.id].manager_feedback}</p>
                    </div>
                  )}

                  {/* Strengths */}
                  {feedback[activeTask.id].strengths?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-foreground flex items-center gap-1 mb-2">
                        <ThumbsUp className="w-3.5 h-3.5 text-accent" /> Strengths
                      </h4>
                      <ul className="space-y-1.5">
                        {feedback[activeTask.id].strengths.map((s: any, i: number) => (
                          <li key={i} className="text-xs text-muted-foreground bg-accent/5 border border-accent/10 rounded-md p-2">
                            <span className="font-medium text-foreground">{s.point}</span>
                            {s.quote && <span className="block italic mt-0.5">"{s.quote}"</span>}
                            {s.why && <span className="block mt-0.5 text-muted-foreground">{s.why}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Improvements */}
                  {feedback[activeTask.id].improvements?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-foreground flex items-center gap-1 mb-2">
                        <ThumbsDown className="w-3.5 h-3.5 text-destructive" /> Areas for Improvement
                      </h4>
                      <ul className="space-y-1.5">
                        {feedback[activeTask.id].improvements.map((imp: any, i: number) => (
                          <li key={i} className="text-xs text-muted-foreground bg-destructive/5 border border-destructive/10 rounded-md p-2">
                            <span className="font-medium text-foreground">{imp.point}</span>
                            {imp.quote && <span className="block italic mt-0.5">"{imp.quote}"</span>}
                            {imp.suggestion && <span className="block mt-0.5 text-primary">💡 {imp.suggestion}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendation */}
                  {feedback[activeTask.id].recommendation && (
                    <div className="bg-secondary/30 rounded-lg p-4 text-sm text-muted-foreground mb-4 border-l-4 border-accent">
                      <p className="font-medium text-foreground mb-1">💬 My recommendation for you:</p>
                      <p>{feedback[activeTask.id].recommendation}</p>
                    </div>
                  )}

                  {/* Overall Score — after manager feedback */}
                  <div className="flex items-center gap-3 mb-4 p-3 bg-secondary/30 rounded-lg">
                    <div className="text-3xl font-bold text-foreground">{feedback[activeTask.id].score}/10</div>
                    <div className="flex-1">
                      <Progress value={feedback[activeTask.id].score * 10} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Overall Score</p>
                    </div>
                  </div>

                  {/* Dimension Scores */}
                  {feedback[activeTask.id].scores && (
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(feedback[activeTask.id].scores).map(([key, val]: [string, any]) => (
                        <div key={key} className="bg-secondary/20 rounded-lg p-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-foreground capitalize">{key.replace(/_/g, " ")}</span>
                            <span className="text-xs font-bold text-primary">{val.score}/10</span>
                          </div>
                          <Progress value={val.score * 10} className="h-1.5 mt-1" />
                          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{val.reason}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Action */}
              <div className="flex items-center gap-3">
                {!isActiveWeekFuture && (
                  <Button
                    variant={isActiveTaskDone ? "outline" : "default"}
                    onClick={() => toggleTask(activeTask.id)}
                  >
                    <Checkbox
                      checked={isActiveTaskDone}
                      className="mr-2"
                      onCheckedChange={() => {}}
                    />
                    {isActiveTaskDone ? "Mark Incomplete" : "Mark Complete"}
                  </Button>
                )}
                {(() => {
                  const currentIdx = allTasks.findIndex((t) => t.id === activeTaskId);
                  const nextTask = allTasks.slice(currentIdx + 1).find(
                    (t) => !completedTasks.has(t.id) && t.weekNum <= currentWeek
                  );
                  if (nextTask) {
                    return (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setActiveTaskId(nextTask.id);
                          setExpandedWeeks((prev) => new Set([...prev, nextTask.weekNum]));
                        }}
                      >
                        Next Task <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    );
                  }
                  return null;
                })()}
                <Button variant="outline" size="sm" className="ml-auto" asChild>
                  <Link to="/dashboard">Exit</Link>
                </Button>
              </div>

              {/* All tasks complete celebration */}
              {totalCompleted === allTasks.length && allTasks.length > 0 && (
                <div className="mt-8 bg-accent/10 border border-accent/30 rounded-xl p-6 text-center animate-fade-in">
                  <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
                  <h3 className="font-semibold text-foreground">All Tasks Complete! 🎉</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You've completed your entire internship simulation. Great work!
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Select a task from the weekly schedule to get started</p>
              </div>
            </div>
          )}

          {/* Mobile week nav */}
          <div className="md:hidden mt-6 space-y-2">
            {schedule.map((week) => {
              const wTasks = allTasks.filter((t) => t.weekNum === week.week);
              const isLocked = week.week > currentWeek;
              const isExpanded = expandedWeeks.has(week.week);
              return (
                <div key={week.week} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => !isLocked && toggleWeekExpand(week.week)}
                    disabled={isLocked}
                    className={`w-full flex items-center gap-2 p-3 text-left text-sm ${isLocked ? "opacity-50" : ""}`}
                  >
                    <span className="font-medium flex-1">Week {week.week}: {week.title}</span>
                    {!isLocked && (isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                  </button>
                  {isExpanded && !isLocked && (
                    <div className="px-3 pb-3 space-y-1">
                      {wTasks.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => setActiveTaskId(task.id)}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-left ${
                            task.id === activeTaskId ? "bg-primary/10" : "hover:bg-secondary"
                          }`}
                        >
                          {completedTasks.has(task.id)
                            ? <CheckCircle className="w-3.5 h-3.5 text-accent shrink-0" />
                            : <div className="w-3.5 h-3.5 rounded-full border-2 border-muted-foreground/40 shrink-0" />
                          }
                          <span className={completedTasks.has(task.id) ? "line-through opacity-60" : ""}>
                            {task.dayNum ? `Day ${task.dayNum}: ` : ""}{task.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ActiveSimulation;
