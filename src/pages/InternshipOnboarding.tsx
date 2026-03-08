import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Zap, ArrowRight, ArrowLeft, Building2, Briefcase, Shield, GraduationCap,
  CalendarDays, CheckCircle2, Clock, Users, Target, BookOpen, FileCheck,
  Crown, UserCircle2, ArrowDown,
} from "lucide-react";

interface CompanyData {
  id: string;
  name: string;
  industry: string;
  size: string;
  description: string;
  culture: string;
}

interface SimState {
  roleId: string;
  roleTitle: string;
  company: CompanyData;
  duration: string;
  difficulty: string;
  managerStyle: string;
}

const roleJobDescriptions: Record<string, { summary: string; responsibilities: string[]; tools: string[] }> = {
  "marketing-analyst": {
    summary: "As a Marketing Analyst intern, you'll support the marketing team by analyzing campaign performance, identifying audience trends, and producing data-driven recommendations.",
    responsibilities: [
      "Analyze marketing campaign metrics and prepare performance reports",
      "Conduct competitive research and market analysis",
      "Draft and edit marketing copy for social media and email campaigns",
      "Collaborate with the design team on creative briefs",
      "Present weekly findings to the marketing manager",
    ],
    tools: ["Google Analytics", "HubSpot", "Canva", "Google Sheets", "Slack"],
  },
  "data-analyst": {
    summary: "As a Data Analyst intern, you'll work with cross-functional teams to collect, clean, and interpret datasets that drive business decisions.",
    responsibilities: [
      "Clean and transform raw datasets for analysis",
      "Build dashboards and data visualizations",
      "Identify trends, outliers, and key performance indicators",
      "Write summary reports for leadership review",
      "Validate data quality and flag inconsistencies",
    ],
    tools: ["SQL", "Python/Pandas", "Tableau", "Google Sheets", "Jupyter Notebooks"],
  },
  "ui-ux-designer": {
    summary: "As a UI/UX Design intern, you'll participate in the full design cycle — from user research to prototyping — under the guidance of a senior designer.",
    responsibilities: [
      "Conduct user interviews and synthesize findings",
      "Create wireframes and low-fidelity prototypes",
      "Design high-fidelity mockups in Figma",
      "Participate in design critiques and iterate based on feedback",
      "Document design decisions and maintain the component library",
    ],
    tools: ["Figma", "FigJam", "Maze (usability testing)", "Notion", "Slack"],
  },
};

const companyPolicies: Record<string, { policies: string[]; values: string[] }> = {
  nexora: {
    policies: [
      "All work is submitted through the internal project tracker by EOD Friday",
      "Standups are held daily at 9:30 AM — attendance is mandatory",
      "Confidential financial data must not be shared outside the team",
      "Use company Slack channels for all work communication",
    ],
    values: ["Speed over perfection", "Radical transparency", "Customer obsession", "Data-informed decisions"],
  },
  greenleaf: {
    policies: [
      "All external communications must be reviewed by the comms team",
      "Field data must be anonymized before analysis",
      "Weekly impact reports are due every Monday",
      "Respect local cultural norms when creating community-facing materials",
    ],
    values: ["Impact first", "Empathy & inclusion", "Evidence-based action", "Community partnership"],
  },
  vividstyle: {
    policies: [
      "Brand guidelines must be followed in all creative output",
      "Trend reports are submitted bi-weekly to the creative director",
      "Social media drafts require approval before publishing",
      "Sustainability claims must be fact-checked with the supply chain team",
    ],
    values: ["Bold creativity", "Sustainable fashion", "Authenticity", "Global perspective"],
  },
  "atlas-robotics": {
    policies: [
      "All technical documents follow the ISO documentation standard",
      "Code and design reviews are mandatory before deployment",
      "Safety protocols must be followed when referencing hardware specs",
      "Weekly progress reports are submitted to the engineering lead",
    ],
    values: ["Engineering excellence", "Safety first", "Continuous improvement", "Precision & reliability"],
  },
  pulseplay: {
    policies: [
      "Sprint planning happens every Monday — come prepared with estimates",
      "All creative assets must be uploaded to the shared drive by sprint end",
      "Player feedback data is confidential and anonymized",
      "Game design docs are living documents — keep them updated",
    ],
    values: ["Player delight", "Creative courage", "Ship & iterate", "Team synergy"],
  },
};

const durationWeeks: Record<string, number> = { "1": 1, "2": 2, "4": 4 };

const generateSchedule = (weeks: number, roleTitle: string) => {
  const base = [
    { week: 1, title: "Orientation & Setup", items: ["Complete onboarding checklist", "Meet your manager & team", "Set up tools & accounts", "Review first assignment brief"] },
  ];
  if (weeks >= 2) {
    base.push({ week: 2, title: "Deep Dive & First Deliverable", items: [`Submit first ${roleTitle} deliverable`, "Attend team sync meeting", "Receive and apply feedback", "Begin second assignment"] });
  }
  if (weeks >= 4) {
    base.push({ week: 3, title: "Independent Work", items: ["Lead a small project independently", "Present mid-point findings", "Collaborate cross-functionally", "Refine skills based on feedback"] });
    base.push({ week: 4, title: "Final Project & Review", items: ["Complete capstone deliverable", "Prepare final presentation", "Performance review with manager", "Receive internship completion certificate"] });
  }
  return base;
};

const sections = [
  { id: "welcome", label: "Welcome", icon: Building2 },
  { id: "role", label: "Your Role", icon: Briefcase },
  { id: "policies", label: "Policies & Values", icon: Shield },
  { id: "training", label: "Training & Tools", icon: GraduationCap },
  { id: "schedule", label: "Your Schedule", icon: CalendarDays },
];

const InternshipOnboarding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const simState = location.state as SimState | null;

  const roleId = simState?.roleId || "marketing-analyst";
  const roleTitle = simState?.roleTitle || "Marketing Analyst";
  const company = simState?.company || { id: "nexora", name: "Nexora", industry: "Fintech Startup", size: "50 employees", description: "A fast-growing digital payments startup.", culture: "Move fast, data-driven" };
  const duration = simState?.duration || "1";
  const difficulty = simState?.difficulty || "intern";
  const managerStyle = simState?.managerStyle || "supportive";

  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());

  const jobDesc = roleJobDescriptions[roleId] || roleJobDescriptions["marketing-analyst"];
  const policies = companyPolicies[company.id] || companyPolicies["nexora"];
  const weeks = durationWeeks[duration] || 1;
  const schedule = generateSchedule(weeks, roleTitle);

  const progressPercent = ((completedSections.size) / sections.length) * 100;

  const markCompleteAndNext = () => {
    const updated = new Set(completedSections);
    updated.add(currentSection);
    setCompletedSections(updated);
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const allComplete = completedSections.size === sections.length;

  const startSimulation = () => {
    navigate("/simulation/active", { state: simState });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-accent" />
            <span className="text-xl font-bold">Internly</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Orientation — {company.name}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Progress header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Welcome to {company.name}</h1>
            <span className="text-sm text-muted-foreground">{completedSections.size}/{sections.length} completed</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar navigation */}
          <div className="space-y-1">
            {sections.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === currentSection;
              const isDone = completedSections.has(i);
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentSection(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm transition-all ${
                    isActive
                      ? "bg-primary/10 border border-primary text-foreground"
                      : isDone
                      ? "text-accent hover:bg-secondary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4 text-accent shrink-0" /> : <Icon className="w-4 h-4 shrink-0" />}
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Content area */}
          <div className="bg-card border border-border rounded-xl p-8 min-h-[500px]">
            {/* WELCOME */}
            {currentSection === 0 && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{company.name}</h2>
                      <p className="text-sm text-muted-foreground">{company.industry} · {company.size}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{company.description}</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-5">
                  <h3 className="font-semibold mb-2 flex items-center gap-2"><Users className="w-4 h-4 text-accent" /> Culture & Environment</h3>
                  <p className="text-sm text-muted-foreground">{company.culture}</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-5">
                  <h3 className="font-semibold mb-2 flex items-center gap-2"><Target className="w-4 h-4 text-accent" /> Your Internship</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground block">Role</span>
                      <span className="font-medium">{roleTitle}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Duration</span>
                      <span className="font-medium">{weeks} week{weeks > 1 ? "s" : ""}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Level</span>
                      <span className="font-medium capitalize">{difficulty}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ROLE */}
            {currentSection === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1 flex items-center gap-2"><Briefcase className="w-5 h-5 text-accent" /> {roleTitle}</h2>
                  <p className="text-muted-foreground leading-relaxed">{jobDesc.summary}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Key Responsibilities</h3>
                  <ul className="space-y-2">
                    {jobDesc.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-secondary/50 rounded-lg p-5">
                  <h3 className="font-semibold mb-2">Manager Style</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    Your manager's style is <strong>{managerStyle}</strong>.
                    {managerStyle === "supportive" && " Expect encouraging feedback, detailed guidance, and patience as you learn."}
                    {managerStyle === "demanding" && " Expect high standards, direct feedback, and a focus on results and efficiency."}
                    {managerStyle === "detail-oriented" && " Expect thorough reviews, analytical questions, and a focus on precision."}
                  </p>
                </div>
              </div>
            )}

            {/* POLICIES */}
            {currentSection === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-accent" /> Company Policies</h2>
                  <ul className="space-y-3">
                    {policies.policies.map((p, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm bg-secondary/50 rounded-lg p-4">
                        <FileCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-accent" /> Core Values</h3>
                  <div className="flex flex-wrap gap-2">
                    {policies.values.map((v, i) => (
                      <span key={i} className="text-sm bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full">{v}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TRAINING */}
            {currentSection === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-accent" /> Required Training</h2>
                  <div className="space-y-3">
                    {[
                      { title: "Company Culture & Code of Conduct", duration: "15 min", desc: "Understand how we work and our expectations for professional behavior." },
                      { title: `${roleTitle} Fundamentals`, duration: "30 min", desc: "A refresher on core skills and methodologies used in your role." },
                      { title: "Tools & Systems Orientation", duration: "20 min", desc: "Get familiar with the platforms and tools you'll use daily." },
                      { title: "Communication & Feedback Norms", duration: "10 min", desc: "Learn how to give and receive feedback effectively in our team." },
                    ].map((t, i) => (
                      <div key={i} className="bg-secondary/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{t.title}</h4>
                          <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{t.duration}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{t.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 text-accent" /> Tools You'll Use</h3>
                  <div className="flex flex-wrap gap-2">
                    {jobDesc.tools.map((t, i) => (
                      <span key={i} className="text-sm bg-secondary text-muted-foreground px-3 py-1.5 rounded-md">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SCHEDULE */}
            {currentSection === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CalendarDays className="w-5 h-5 text-accent" /> Your {weeks}-Week Schedule</h2>
                <div className="space-y-4">
                  {schedule.map((w) => (
                    <div key={w.week} className="bg-secondary/50 rounded-lg p-5">
                      <h3 className="font-semibold mb-3">Week {w.week}: {w.title}</h3>
                      <ul className="space-y-2">
                        {w.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                disabled={currentSection === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Previous
              </Button>

              {currentSection < sections.length - 1 ? (
                <Button variant="hero" onClick={markCompleteAndNext}>
                  Mark Complete & Next <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  variant="hero"
                  onClick={() => {
                    markCompleteAndNext();
                  }}
                  className={allComplete ? "opacity-50" : ""}
                >
                  {completedSections.has(currentSection) ? "Completed ✓" : "Complete Section"}
                </Button>
              )}
            </div>

            {/* Start button when all done */}
            {allComplete && (
              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-sm text-muted-foreground mb-4">You've completed your orientation at {company.name}!</p>
                <Button variant="hero" size="lg" className="text-lg px-8 py-6" onClick={startSimulation}>
                  Start Your Internship <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipOnboarding;
