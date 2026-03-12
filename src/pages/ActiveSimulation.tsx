import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Zap, CheckCircle, Clock, AlertCircle, ChevronRight, ChevronLeft,
  CalendarDays, Lock, Trophy, FileText, ChevronDown, ChevronUp,
} from "lucide-react";
import { useProgress, STEPS } from "@/hooks/useProgress";
import { generateSchedule, type WeekSchedule, type DailyTask } from "@/data/schedule";

// ── Helpers ──

interface TaskItem {
  id: string;
  weekNum: number;
  dayNum?: number;
  title: string;
  deliverable?: string;
  deadline?: string;
  isGroupTask: boolean;
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
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      persistTasks(next);
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
                {/* Navigate to next incomplete task */}
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
