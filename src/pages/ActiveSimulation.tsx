import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Zap, CheckCircle, Clock, AlertCircle, ChevronRight, ChevronLeft,
  CalendarDays, Lock, Trophy, FileText,
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

/** Build a flat list of trackable tasks from the generated schedule */
function buildTaskList(schedule: WeekSchedule[]): TaskItem[] {
  const tasks: TaskItem[] = [];

  for (const week of schedule) {
    // If daily tasks exist for this week, use those as the primary tasks
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
      // Use generic weekly items (skip the group task line—it's added separately)
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

/** Determine the simulated "current week" based on orientation completion date */
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

  // Restore simulation state
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

  // Generate schedule & tasks
  const schedule = useMemo(
    () => generateSchedule(durationWeeks, roleTitle, roleId, company.id),
    [durationWeeks, roleTitle, roleId, company.id]
  );
  const allTasks = useMemo(() => buildTaskList(schedule), [schedule]);

  // Current week (simulated)
  const orientationCompletedAt = savedOrientation?.status === "completed" ? savedOrientation.updated_at : undefined;
  const currentWeek = getCurrentWeek(orientationCompletedAt, durationWeeks);

  // Selected week for viewing
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  // Completed task IDs (persisted in user_progress metadata)
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);

  // Restore completed tasks from progress
  useEffect(() => {
    if (progressLoading || initialized) return;
    const saved = savedSimulation?.metadata?.completedTasks;
    if (Array.isArray(saved)) {
      setCompletedTasks(new Set(saved));
    }
    setInitialized(true);
  }, [progressLoading, initialized, savedSimulation]);

  // Auto-close overdue tasks (past weeks)
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

  // Persist completed tasks
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
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      persistTasks(next);
      return next;
    });
  };

  // Tasks for selected week
  const weekTasks = allTasks.filter((t) => t.weekNum === selectedWeek);
  const weekSchedule = schedule.find((w) => w.week === selectedWeek);
  const weekCompletedCount = weekTasks.filter((t) => completedTasks.has(t.id)).length;
  const weekProgress = weekTasks.length > 0 ? (weekCompletedCount / weekTasks.length) * 100 : 0;

  // Overall progress
  const totalCompleted = allTasks.filter((t) => completedTasks.has(t.id)).length;
  const overallProgress = allTasks.length > 0 ? (totalCompleted / allTasks.length) * 100 : 0;

  // Check if all tasks done → mark simulation complete
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

  const isPastWeek = selectedWeek < currentWeek;
  const isFutureWeek = selectedWeek > currentWeek;

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
        {/* Sidebar — Week Navigator */}
        <aside className="hidden md:flex w-72 border-r border-border bg-card flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-sm">Weekly Schedule</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{durationWeeks}-week internship</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {schedule.map((week) => {
              const wTasks = allTasks.filter((t) => t.weekNum === week.week);
              const wDone = wTasks.filter((t) => completedTasks.has(t.id)).length;
              const allDone = wDone === wTasks.length && wTasks.length > 0;
              const isCurrentWeek = week.week === currentWeek;
              const isLocked = week.week > currentWeek;
              const isSelected = week.week === selectedWeek;

              return (
                <button
                  key={week.week}
                  onClick={() => !isLocked && setSelectedWeek(week.week)}
                  disabled={isLocked}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm transition-colors ${
                    isSelected
                      ? "bg-primary/10 border border-primary/30"
                      : isLocked
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
                    <div className={`font-medium truncate ${isLocked ? "text-muted-foreground" : "text-foreground"}`}>
                      Week {week.week}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{week.title}</div>
                  </div>
                  <Badge
                    variant={allDone ? "default" : "secondary"}
                    className="text-[10px] shrink-0"
                  >
                    {wDone}/{wTasks.length}
                  </Badge>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-4xl mx-auto w-full">
          {/* Week Header */}
          <div className="mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={selectedWeek <= 1}
                  onClick={() => setSelectedWeek((w) => Math.max(1, w - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">
                    Week {selectedWeek}: {weekSchedule?.title}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {isPastWeek && "Completed week"}
                    {!isPastWeek && !isFutureWeek && `Current week • ${weekTasks.length - weekCompletedCount} tasks remaining`}
                    {isFutureWeek && "Upcoming — locked until deadline"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={selectedWeek >= currentWeek}
                  onClick={() => setSelectedWeek((w) => Math.min(currentWeek, w + 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              {weekSchedule && (
                <Badge variant="secondary" className="hidden md:flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  Role: {weekSchedule.assignedRole}
                </Badge>
              )}
            </div>
            <Progress value={weekProgress} className="h-2" />
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {weekTasks.map((task) => {
              const isDone = completedTasks.has(task.id);
              const isOverdue = isPastWeek && !isDone;
              const dailyTask = weekSchedule?.dailyTasks?.find((dt) => dt.day === task.dayNum);

              return (
                <div
                  key={task.id}
                  className={`bg-card border rounded-xl overflow-hidden shadow-card transition-all ${
                    isDone
                      ? "border-accent/30 bg-accent/5"
                      : isOverdue
                      ? "border-destructive/30 bg-destructive/5"
                      : "border-border"
                  }`}
                >
                  {/* Task header */}
                  <div className="p-4 flex items-start gap-3">
                    <Checkbox
                      checked={isDone}
                      onCheckedChange={() => !isFutureWeek && toggleTask(task.id)}
                      disabled={isFutureWeek}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-medium text-sm ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {task.dayNum != null && (
                            <span className="text-primary font-bold mr-1.5">Day {task.dayNum}</span>
                          )}
                          {task.title}
                        </span>
                        {task.isGroupTask && (
                          <Badge variant="secondary" className="text-[10px]">Group</Badge>
                        )}
                        {isDone && (
                          <CheckCircle className="w-3.5 h-3.5 text-accent" />
                        )}
                      </div>
                      {task.deliverable && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          Deliverable: {task.deliverable}
                        </p>
                      )}
                      {task.deadline && (
                        <p className={`text-xs mt-0.5 flex items-center gap-1 ${
                          isOverdue ? "text-destructive" : "text-muted-foreground"
                        }`}>
                          <Clock className="w-3 h-3" />
                          {task.deadline}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Expanded daily task details */}
                  {dailyTask && !isDone && (
                    <div className="px-4 pb-4 pt-0 ml-9 border-t border-border mt-0">
                      <div className="pt-3 space-y-2">
                        {dailyTask.client && (
                          <p className="text-xs text-foreground">
                            <span className="font-semibold">Client:</span> {dailyTask.client}
                            {dailyTask.clientIndustry && ` (${dailyTask.clientIndustry})`}
                          </p>
                        )}
                        {dailyTask.campaignGoal && (
                          <p className="text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">Goal:</span> {dailyTask.campaignGoal}
                          </p>
                        )}
                        {dailyTask.deliverableDetails && dailyTask.deliverableDetails.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-foreground mb-1">Requirements:</p>
                            <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
                              {dailyTask.deliverableDetails.map((detail, i) => (
                                <li key={i}>{detail}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {dailyTask.note && (
                          <p className="text-xs text-muted-foreground italic bg-secondary/30 rounded-md p-2">
                            💡 {dailyTask.note}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Week complete celebration */}
          {weekProgress === 100 && (
            <div className="mt-6 bg-accent/10 border border-accent/30 rounded-xl p-6 text-center animate-fade-in">
              <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
              <h3 className="font-semibold text-foreground">Week {selectedWeek} Complete!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                All tasks completed. {selectedWeek < currentWeek ? "Great job!" : "Move on to the next week when it unlocks."}
              </p>
              {selectedWeek < schedule.length && selectedWeek < currentWeek && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setSelectedWeek(Math.min(selectedWeek + 1, currentWeek))}
                >
                  View Next Week <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              )}
            </div>
          )}

          {/* Mobile week nav */}
          <div className="md:hidden flex items-center justify-between mt-6 gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={selectedWeek <= 1}
              onClick={() => setSelectedWeek((w) => Math.max(1, w - 1))}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <span className="text-sm text-muted-foreground">Week {selectedWeek}/{schedule.length}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={selectedWeek >= currentWeek}
              onClick={() => setSelectedWeek((w) => Math.min(currentWeek, w + 1))}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ActiveSimulation;
