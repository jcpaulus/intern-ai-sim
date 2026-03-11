import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Zap, ArrowRight, ArrowLeft, Building2, Briefcase, Shield, GraduationCap,
  CalendarDays, CheckCircle2, Clock, Users, Target, BookOpen, FileCheck,
  Crown, UserCircle2, ArrowDown, Video, UsersRound, UserCog, FileText,
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
  level: string;
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
  brightwave: {
    policies: [
      "All campaign content must be approved by the Marketing Manager before publishing",
      "Client data and campaign analytics are confidential — do not share externally",
      "Weekly status reports are submitted every Friday by 3:00 PM",
      "Use Slack for internal communication and Asana for task tracking",
    ],
    values: ["Creative excellence", "Data-driven decisions", "Client-first mindset", "Collaborative innovation"],
  },
};

const durationWeeks: Record<string, number> = { "2": 2, "4": 4, "6": 6, "8": 8, "12": 12 };

interface DailyTask {
  day: number;
  title: string;
  client?: string;
  clientIndustry?: string;
  clientProducts?: string;
  campaignGoal?: string;
  targetAudience?: string;
  platforms?: string[];
  analysisAreas?: string[];
  identifyItems?: string[];
  deliverable?: string;
  deliverableDetails?: string[];
  deadline?: string;
  note?: string;
}

interface WeekSchedule {
  week: number;
  title: string;
  items: string[];
  groupTask: string;
  zoomLink: string;
  assignedRole: string;
  dailyTasks?: DailyTask[];
}

// Role + Company specific detailed daily task assignments
// Key format: "{roleId}:{companyId}:week{N}"
const detailedDailyTasks: Record<string, DailyTask[]> = {
  "marketing-associate:brightwave:week1": [
    {
      day: 3,
      title: "Social Media Marketing Audit",
      client: "FitLife Wellness",
      clientIndustry: "Fitness & Wellness",
      clientProducts: "Online fitness coaching and wellness programs",
      campaignGoal: "Increase engagement and brand awareness among young professionals interested in health and fitness.",
      targetAudience: "Professionals aged 22–35 who are interested in improving their health, productivity, and lifestyle.",
      platforms: ["Instagram", "LinkedIn", "TikTok or X"],
      analysisAreas: [
        "Content type",
        "Engagement levels",
        "Posting frequency",
        "Audience interaction",
      ],
      identifyItems: [
        "The best performing posts",
        "The weak performing posts",
        "Any content gaps in the current content strategy",
      ],
      deliverable: "Social Media Audit Report",
      deliverableDetails: [
        "The top 3 performing posts",
        "Key engagement patterns",
        "Suggested improvements to strengthen the client's social media strategy",
        "Two recommended content ideas that could improve engagement in the next phase of the campaign",
      ],
      deadline: "5:00 PM — to be reviewed during tomorrow's team check-in",
      note: "Let your manager know if you need clarification before getting started.",
    },
  ],
};

const groupTasksByWeek: Record<number, string> = {
  1: "Team Introduction & Icebreaker Presentation",
  2: "Collaborative SWOT Analysis Workshop",
  3: "Cross-Functional Problem-Solving Sprint",
  4: "Group Case Study Analysis & Presentation",
  5: "Team Strategy Proposal Development",
  6: "Peer Review & Knowledge Sharing Session",
  7: "Cross-Department Collaboration Challenge",
  8: "Group Process Improvement Initiative",
  9: "Leadership Roundtable Discussion",
  10: "Capstone Planning & Team Alignment",
  11: "Capstone Dry Run & Group Feedback",
  12: "Final Group Showcase & Retrospective",
};

const assignedRolesByWeek: Record<number, string> = {
  1: "Note-Taker",
  2: "Researcher",
  3: "Presenter",
  4: "Team Lead",
  5: "Analyst",
  6: "Reviewer",
  7: "Coordinator",
  8: "Facilitator",
  9: "Strategist",
  10: "Project Manager",
  11: "Quality Checker",
  12: "Spokesperson",
};

const generateSchedule = (weeks: number, roleTitle: string, roleId?: string, companyId?: string): WeekSchedule[] => {
  const baseSchedule: Omit<WeekSchedule, "groupTask" | "zoomLink" | "assignedRole" | "dailyTasks">[] = [
    { week: 1, title: "Orientation & Setup", items: ["Complete onboarding checklist", "Meet your manager & team", "Set up tools & accounts", "Review first assignment brief"] },
    { week: 2, title: "First Deliverable", items: [`Submit first ${roleTitle} deliverable`, "Attend team sync meeting", "Receive and apply feedback", "Begin second assignment"] },
  ];
  if (weeks >= 4) {
    baseSchedule.push({ week: 3, title: "Deep Dive", items: ["Take on more complex tasks", "Collaborate cross-functionally", "Present findings to team", "Refine approach based on feedback"] });
    baseSchedule.push({ week: 4, title: "Independent Work", items: ["Lead a small project independently", "Mid-point performance check-in", "Iterate on deliverables", "Expand responsibilities"] });
  }
  if (weeks >= 6) {
    baseSchedule.push({ week: 5, title: "Advanced Projects", items: ["Tackle a stretch assignment", "Mentor newer team members", "Attend leadership meeting", "Build portfolio piece"] });
    baseSchedule.push({ week: 6, title: "Specialization", items: ["Choose a focus area to go deeper", "Produce a detailed case study", "Get peer feedback", "Prepare mid-program review"] });
  }
  if (weeks >= 8) {
    baseSchedule.push({ week: 7, title: "Cross-Team Collaboration", items: ["Join a cross-functional initiative", "Present to another department", "Integrate feedback from multiple stakeholders", "Refine communication skills"] });
    baseSchedule.push({ week: 8, title: "Ownership Phase", items: ["Own an end-to-end project", "Make strategic recommendations", "Document processes", "Prepare handoff materials"] });
  }
  if (weeks >= 12) {
    baseSchedule.push({ week: 9, title: "Leadership & Strategy", items: ["Propose a process improvement", "Lead a team meeting", "Analyze long-term trends", "Draft strategic brief"] });
    baseSchedule.push({ week: 10, title: "Capstone Preparation", items: ["Define capstone project scope", "Gather data and insights", "Build presentation outline", "Get manager approval on direction"] });
    baseSchedule.push({ week: 11, title: "Capstone Execution", items: ["Complete capstone deliverable", "Rehearse final presentation", "Collect testimonials from peers", "Polish all portfolio materials"] });
    baseSchedule.push({ week: 12, title: "Final Review & Graduation", items: ["Deliver final presentation to leadership", "Performance review with manager", "Receive internship completion certificate", "Celebrate achievements 🎉"] });
  }

  return baseSchedule.map((w) => {
    const dailyTaskKey = roleId && companyId ? `${roleId}:${companyId}:week${w.week}` : "";
    return {
      ...w,
      groupTask: groupTasksByWeek[w.week] || "Group Collaboration Task",
      zoomLink: `https://zoom.us/j/internly-week-${w.week}-${Date.now().toString(36).slice(-4)}`,
      assignedRole: assignedRolesByWeek[w.week] || "Contributor",
      dailyTasks: dailyTaskKey ? detailedDailyTasks[dailyTaskKey] : undefined,
    };
  });
};

interface TeamMember {
  name: string;
  role: string;
  level: "executive" | "director" | "manager" | "senior" | "peer";
  reportsTo?: string;
  bio: string;
  isYourManager?: boolean;
}

const companyTeams: Record<string, TeamMember[]> = {
  nexora: [
    { name: "Rina Patel", role: "CEO & Co-founder", level: "executive", bio: "Former Goldman Sachs VP. Founded Nexora in 2022 to make cross-border payments instant and affordable." },
    { name: "James Okonkwo", role: "CTO", level: "executive", reportsTo: "Rina Patel", bio: "Ex-Stripe engineer. Leads the product and engineering org." },
    { name: "Mei Chen", role: "VP of Marketing", level: "director", reportsTo: "Rina Patel", bio: "Built marketing teams at two fintech unicorns. Oversees brand, growth, and analytics." },
    { name: "David Lim", role: "Marketing Manager", level: "manager", reportsTo: "Mei Chen", bio: "Your direct manager. 5 years in performance marketing. Runs the campaigns and analytics team.", isYourManager: true },
    { name: "Aisha Rahman", role: "Senior Data Analyst", level: "senior", reportsTo: "Mei Chen", bio: "Specializes in funnel analytics. She'll be your go-to for data questions." },
    { name: "Tom Rivera", role: "Marketing Analyst", level: "peer", reportsTo: "David Lim", bio: "Joined 3 months ago. Working on SEO and content analytics — your closest peer." },
  ],
  greenleaf: [
    { name: "Dr. Amara Osei", role: "Executive Director", level: "executive", bio: "Public health physician with 20 years of NGO leadership across Sub-Saharan Africa." },
    { name: "Fatima Zahra", role: "Director of Programs", level: "director", reportsTo: "Dr. Amara Osei", bio: "Manages all field programs across 12 countries. Coordinates with local health ministries." },
    { name: "Carlos Mendez", role: "Head of Communications", level: "director", reportsTo: "Dr. Amara Osei", bio: "Former BBC journalist. Leads storytelling, impact reports, and public engagement." },
    { name: "Sarah Nguyen", role: "Programs Manager", level: "manager", reportsTo: "Fatima Zahra", bio: "Your direct manager. Coordinates research and data collection for maternal health programs.", isYourManager: true },
    { name: "Kwame Asante", role: "Field Data Lead", level: "senior", reportsTo: "Sarah Nguyen", bio: "Manages community health worker data pipelines. Great resource for field context." },
    { name: "Priya Sharma", role: "Research Intern", level: "peer", reportsTo: "Sarah Nguyen", bio: "Started last month. Working on survey design — you'll collaborate on data projects." },
  ],
  vividstyle: [
    { name: "Lena Kraft", role: "Founder & Creative Director", level: "executive", bio: "Fashion designer turned entrepreneur. Built VividStyle from a Depop side-hustle to a global DTC brand." },
    { name: "Marcus Webb", role: "Head of Growth", level: "director", reportsTo: "Lena Kraft", bio: "Scaled two DTC brands to $50M+. Leads performance marketing, CRM, and partnerships." },
    { name: "Yuki Tanaka", role: "Brand Manager", level: "manager", reportsTo: "Marcus Webb", bio: "Your direct manager. Oversees brand campaigns, social strategy, and influencer collabs.", isYourManager: true },
    { name: "Zoe Adebayo", role: "Senior Designer", level: "senior", reportsTo: "Lena Kraft", bio: "Leads visual identity. You'll work with her on creative briefs and brand assets." },
    { name: "Jake Morrison", role: "Content Creator", level: "peer", reportsTo: "Yuki Tanaka", bio: "Handles TikTok and Instagram Reels. Your fellow teammate on the social team." },
  ],
  "atlas-robotics": [
    { name: "Dr. Heinrich Müller", role: "CEO", level: "executive", bio: "Robotics PhD from MIT. 15 years building industrial automation systems before founding Atlas." },
    { name: "Lisa Park", role: "VP of Engineering", level: "director", reportsTo: "Dr. Heinrich Müller", bio: "Oversees all engineering teams — hardware, firmware, and software." },
    { name: "Raj Venkatesh", role: "Director of Product", level: "director", reportsTo: "Dr. Heinrich Müller", bio: "Bridges customer needs with engineering. Manages roadmap and product analytics." },
    { name: "Nadia Kowalski", role: "Engineering Manager", level: "manager", reportsTo: "Lisa Park", bio: "Your direct manager. Leads the analytics and QA team. Very detail-oriented and thorough.", isYourManager: true },
    { name: "Ben Torres", role: "Senior Software Engineer", level: "senior", reportsTo: "Nadia Kowalski", bio: "Full-stack engineer who built the internal dashboard. Mentor for new team members." },
    { name: "Amy Liu", role: "Junior Analyst", level: "peer", reportsTo: "Nadia Kowalski", bio: "Joined 2 months ago. Working on warehouse throughput analytics — you'll pair on projects." },
  ],
  pulseplay: [
    { name: "Alex Dunn", role: "Studio Director & Co-founder", level: "executive", bio: "Game designer who shipped 3 hit mobile RPGs. Leads creative vision and studio culture." },
    { name: "Sofia Reyes", role: "Lead Producer", level: "director", reportsTo: "Alex Dunn", bio: "Manages sprint cycles, team capacity, and release schedules across all projects." },
    { name: "Kai Nakamura", role: "Art Director", level: "director", reportsTo: "Alex Dunn", bio: "Defines the visual style of all PulsePlay titles. Runs the art and UI team." },
    { name: "Jordan Blake", role: "Product Manager", level: "manager", reportsTo: "Sofia Reyes", bio: "Your direct manager. Owns player engagement metrics and feature prioritization.", isYourManager: true },
    { name: "Mia Chang", role: "Senior Game Designer", level: "senior", reportsTo: "Jordan Blake", bio: "Designs narrative quests and economy systems. She'll review your game design work." },
    { name: "Luca Ferreira", role: "QA & Analytics Intern", level: "peer", reportsTo: "Jordan Blake", bio: "Your fellow intern. Focuses on player behavior analytics and bug triage." },
  ],
  brightwave: [
    { name: "Rebecca Torres", role: "CEO & Founder", level: "executive", bio: "Former VP at Ogilvy. Founded BrightWave to bring data-driven creativity to mid-market brands." },
    { name: "Michael Chen", role: "VP of Client Services", level: "director", reportsTo: "Rebecca Torres", bio: "Manages all client relationships and oversees campaign strategy across accounts." },
    { name: "Samantha Brooks", role: "Creative Director", level: "director", reportsTo: "Rebecca Torres", bio: "Leads the creative team. Sets visual direction for all campaigns and brand work." },
    { name: "Daniel Okafor", role: "Marketing Manager", level: "manager", reportsTo: "Michael Chen", bio: "Your direct manager. 7 years in digital marketing. Runs the social media and analytics team.", isYourManager: true },
    { name: "Jessica Huang", role: "Senior Social Media Strategist", level: "senior", reportsTo: "Daniel Okafor", bio: "Specializes in Instagram and TikTok growth strategies. Great resource for social trends." },
    { name: "Ryan Mitchell", role: "Marketing Associate", level: "peer", reportsTo: "Daniel Okafor", bio: "Joined 2 months ago. Working on email campaigns and content calendar — your closest peer." },
  ],
};

const levelColors: Record<string, string> = {
  executive: "bg-accent/20 text-accent border-accent/30",
  director: "bg-primary/20 text-primary border-primary/30",
  manager: "bg-accent/15 text-accent border-accent/25",
  senior: "bg-secondary text-muted-foreground border-border",
  peer: "bg-secondary text-muted-foreground border-border",
};

const levelLabels: Record<string, string> = {
  executive: "Executive",
  director: "Director",
  manager: "Manager",
  senior: "Senior",
  peer: "Your Peer",
};

const sections = [
  { id: "company-team-role", label: "Company, Team & Role", icon: Building2 },
  { id: "policies-training-schedule", label: "Policies, Training & Schedule", icon: Shield },
];

const InternshipOnboarding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const simState = location.state as SimState | null;

  const roleId = simState?.roleId || "marketing-analyst";
  const roleTitle = simState?.roleTitle || "Marketing Analyst";
  const company = simState?.company || { id: "nexora", name: "Nexora", industry: "Fintech Startup", size: "50 employees", description: "A fast-growing digital payments startup.", culture: "Move fast, data-driven" };
  const duration = simState?.duration || "1";
  const level = simState?.level || "intermediate";
  const managerStyle = simState?.managerStyle || "supportive";

  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());

  const jobDesc = roleJobDescriptions[roleId] || roleJobDescriptions["marketing-analyst"];
  const policies = companyPolicies[company.id] || companyPolicies["nexora"];
  const team = companyTeams[company.id] || companyTeams["nexora"];
  const weeks = durationWeeks[duration] || 1;
  const schedule = generateSchedule(weeks, roleTitle, roleId, company.id);

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
          <div className="bg-card border border-border rounded-xl p-8 min-h-[500px] max-h-[70vh] overflow-y-auto">
            {/* STEP 1: Company, Team & Role */}
            {currentSection === 0 && (
              <div className="space-y-10">
                {/* Welcome */}
                <div className="space-y-6">
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
                        <span className="font-medium capitalize">{level}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-border" />

                {/* Meet the Team */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-1 flex items-center gap-2"><Users className="w-5 h-5 text-accent" /> Meet the Team</h2>
                    <p className="text-muted-foreground text-sm">Here are the key people you'll work with at {company.name}.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2"><Crown className="w-4 h-4 text-accent" /> Organization Hierarchy</h3>
                    <div className="space-y-2">
                      {(["executive", "director", "manager", "senior", "peer"] as const).map((level) => {
                        const members = team.filter(m => m.level === level);
                        if (members.length === 0) return null;
                        return (
                          <div key={level}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full border ${levelColors[level]}`}>{levelLabels[level]}</span>
                              {level !== "executive" && <ArrowDown className="w-3 h-3 text-muted-foreground" />}
                            </div>
                            <div className="grid gap-2 mb-3 ml-4">
                              {members.map((m, i) => (
                                <div key={i} className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${m.isYourManager ? "border-accent/40 bg-accent/5 ring-1 ring-accent/20" : "border-border bg-secondary/50"}`}>
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${m.isYourManager ? "bg-accent/20" : "bg-secondary"}`}>
                                    <UserCircle2 className={`w-6 h-6 ${m.isYourManager ? "text-accent" : "text-muted-foreground"}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-medium text-sm">{m.name}</span>
                                      {m.isYourManager && <span className="text-[10px] uppercase tracking-wider font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded">Your Manager</span>}
                                    </div>
                                    <p className="text-xs text-primary/80 font-medium">{m.role}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{m.bio}</p>
                                    {m.reportsTo && <p className="text-[11px] text-muted-foreground/60 mt-1">Reports to {m.reportsTo}</p>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {(() => {
                    const manager = team.find(m => m.isYourManager);
                    if (!manager) return null;
                    return (
                      <div className="bg-accent/5 border border-accent/20 rounded-lg p-5">
                        <h3 className="font-semibold mb-2 text-accent text-sm">💬 A note from your manager</h3>
                        <p className="text-sm text-muted-foreground italic">
                          "Welcome to the team! I'm {manager.name.split(" ")[0]}, your {manager.role}. I'm excited to have you on board. Don't hesitate to ask questions — that's what this internship is for. Let's have a great {weeks > 1 ? `${weeks} weeks` : "week"} together!"
                        </p>
                      </div>
                    );
                  })()}
                </div>

                {/* Divider */}
                <hr className="border-border" />

                {/* Your Role */}
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
              </div>
            )}

            {/* STEP 2: Policies, Training & Schedule */}
            {currentSection === 1 && (
              <div className="space-y-10">
                {/* Policies */}
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

                {/* Divider */}
                <hr className="border-border" />

                {/* Training */}
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

                {/* Divider */}
                <hr className="border-border" />

                {/* Schedule */}
                <div className="space-y-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CalendarDays className="w-5 h-5 text-accent" /> Your {weeks}-Week Schedule</h2>
                  <div className="space-y-4">
                    {schedule.map((w) => (
                      <div key={w.week} className="bg-secondary/50 rounded-lg p-5 space-y-4">
                        <h3 className="font-semibold">Week {w.week}: {w.title}</h3>
                        
                        {/* Individual Tasks — assigned by your manager */}
                        {(() => {
                          const manager = team.find(m => m.isYourManager);
                          return (
                            <div>
                              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                                <UserCircle2 className="w-3.5 h-3.5 text-accent" />
                                Assigned by <span className="font-semibold text-foreground">{manager?.name || "Your Manager"}</span>
                                <span className="text-muted-foreground/60">({manager?.role || "Manager"})</span>
                              </p>
                              <ul className="space-y-2">
                                {w.items.map((item, i) => (
                                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })()}

                        {/* Group Task, Zoom Link, Assigned Role */}
                        <div className="grid sm:grid-cols-3 gap-3 pt-3 border-t border-border">
                          <div className="flex items-start gap-2 bg-primary/5 border border-primary/15 rounded-lg p-3">
                            <UsersRound className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <div>
                              <span className="text-[11px] uppercase tracking-wider font-semibold text-primary block mb-0.5">Group Task</span>
                              <span className="text-xs text-muted-foreground">{w.groupTask}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 bg-accent/5 border border-accent/15 rounded-lg p-3">
                            <Video className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                            <div>
                              <span className="text-[11px] uppercase tracking-wider font-semibold text-accent block mb-0.5">Weekly Meeting</span>
                              <a href={w.zoomLink} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline underline-offset-2 hover:text-primary/80 break-all">
                                Join Zoom
                              </a>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 bg-secondary border border-border rounded-lg p-3">
                            <UserCog className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block mb-0.5">Your Role</span>
                              <span className="text-xs text-foreground font-medium">{w.assignedRole}</span>
                            </div>
                          </div>
                        </div>

                        {/* Detailed Daily Task Assignments */}
                        {w.dailyTasks && w.dailyTasks.length > 0 && (
                          <div className="space-y-3 pt-3 border-t border-border">
                            <h4 className="text-sm font-semibold flex items-center gap-2">
                              <FileText className="w-4 h-4 text-primary" />
                              Detailed Task Assignments
                            </h4>
                            {w.dailyTasks.map((dt, dti) => {
                              const manager = team.find(m => m.isYourManager);
                              return (
                                <div key={dti} className="bg-background border border-primary/20 rounded-lg p-5 space-y-4">
                                  <div className="flex items-center justify-between flex-wrap gap-2">
                                    <div>
                                      <span className="text-[11px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                        Day {dt.day}
                                      </span>
                                      <h5 className="text-base font-bold mt-2">{dt.title}</h5>
                                    </div>
                                    {dt.deadline && (
                                      <span className="text-xs text-muted-foreground flex items-center gap-1 bg-secondary px-2 py-1 rounded">
                                        <Clock className="w-3 h-3" /> Due: {dt.deadline}
                                      </span>
                                    )}
                                  </div>

                                  {/* Manager attribution */}
                                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                    <UserCircle2 className="w-3.5 h-3.5 text-accent" />
                                    Assigned by <span className="font-semibold text-foreground">{manager?.name || "Your Manager"}</span>
                                    <span className="text-muted-foreground/60">({manager?.role || "Manager"})</span>
                                  </p>

                                  {/* Client Info */}
                                  {dt.client && (
                                    <div className="bg-secondary/70 rounded-lg p-4 space-y-1">
                                      <p className="text-sm font-semibold">Client: {dt.client}</p>
                                      {dt.clientIndustry && <p className="text-xs text-muted-foreground">Industry: {dt.clientIndustry}</p>}
                                      {dt.clientProducts && <p className="text-xs text-muted-foreground">Products: {dt.clientProducts}</p>}
                                    </div>
                                  )}

                                  {/* Campaign Goal */}
                                  {dt.campaignGoal && (
                                    <div>
                                      <p className="text-xs font-semibold text-foreground mb-1">Campaign Goal:</p>
                                      <p className="text-sm text-muted-foreground">{dt.campaignGoal}</p>
                                    </div>
                                  )}

                                  {/* Target Audience */}
                                  {dt.targetAudience && (
                                    <div>
                                      <p className="text-xs font-semibold text-foreground mb-1">Target Audience:</p>
                                      <p className="text-sm text-muted-foreground">{dt.targetAudience}</p>
                                    </div>
                                  )}

                                  {/* Platforms */}
                                  {dt.platforms && dt.platforms.length > 0 && (
                                    <div>
                                      <p className="text-xs font-semibold text-foreground mb-2">Platforms to Review:</p>
                                      <div className="flex flex-wrap gap-2">
                                        {dt.platforms.map((p, pi) => (
                                          <span key={pi} className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full">{p}</span>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Analysis Areas */}
                                  {dt.analysisAreas && dt.analysisAreas.length > 0 && (
                                    <div>
                                      <p className="text-xs font-semibold text-foreground mb-2">Focus Your Analysis On:</p>
                                      <ul className="space-y-1.5">
                                        {dt.analysisAreas.map((a, ai) => (
                                          <li key={ai} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <Target className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                                            {a}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Identify Items */}
                                  {dt.identifyItems && dt.identifyItems.length > 0 && (
                                    <div>
                                      <p className="text-xs font-semibold text-foreground mb-2">During Your Review, Identify:</p>
                                      <ul className="space-y-1.5">
                                        {dt.identifyItems.map((item, ii) => (
                                          <li key={ii} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                                            {item}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Deliverable */}
                                  {dt.deliverable && (
                                    <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                                      <p className="text-xs font-bold text-accent mb-2 uppercase tracking-wider">📋 Deliverable: {dt.deliverable}</p>
                                      {dt.deliverableDetails && (
                                        <ul className="space-y-1.5">
                                          {dt.deliverableDetails.map((d, di) => (
                                            <li key={di} className="flex items-start gap-2 text-sm text-muted-foreground">
                                              <FileCheck className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                                              {d}
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </div>
                                  )}

                                  {/* Note */}
                                  {dt.note && (
                                    <p className="text-xs text-muted-foreground italic border-l-2 border-accent/30 pl-3 mt-2">
                                      💡 {dt.note}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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
