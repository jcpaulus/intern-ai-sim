import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Zap, ChevronRight, ChevronDown, CheckCircle, Circle, BookOpen,
  Building2, FileText, DollarSign, Shield, MessageSquare, Monitor,
  Scale, ArrowLeft, GraduationCap, Clock,
} from "lucide-react";
import { useProgress, STEPS } from "@/hooks/useProgress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";

/* ─── Step ID for bootcamp ─── */
const BOOTCAMP_STEP = "bootcamp";

/* ─── Module data with real-world content ─── */
interface Topic {
  title: string;
  content: string;
  source?: string;
}

interface Module {
  id: string;
  title: string;
  objective: string;
  icon: React.ComponentType<{ className?: string }>;
  keyConcept: string;
  topics: Topic[];
}

const modules: Module[] = [
  {
    id: "m1",
    title: "Introduction to the Workplace",
    objective: "Understand how organizations function and how work is structured.",
    icon: Building2,
    keyConcept: "Understanding how work moves through an organization.",
    topics: [
      {
        title: "What Organizations Do",
        content:
          "An organization is a structured group of people working together to achieve common goals. Organizations exist to create value — whether through products, services, or social impact. They coordinate human effort, allocate resources, and divide labor to accomplish tasks that individuals cannot achieve alone. According to the U.S. Bureau of Labor Statistics, the U.S. economy includes over 6 million employer establishments, ranging from small businesses to multinational corporations.",
        source: "U.S. Bureau of Labor Statistics (BLS)",
      },
      {
        title: "Departments and Functions",
        content:
          "Most organizations divide work into functional departments: Human Resources (hiring, employee relations), Finance (budgeting, accounting, payroll), Marketing (brand awareness, customer acquisition), Operations (day-to-day production and delivery), Sales (revenue generation), IT (technology infrastructure), and Legal (compliance, contracts). Each department has specialized roles that contribute to the organization's overall mission. The Society for Human Resource Management (SHRM) notes that clear departmental structures improve accountability and efficiency.",
        source: "Society for Human Resource Management (SHRM)",
      },
      {
        title: "Roles Inside a Company",
        content:
          "Every employee holds a defined role with specific responsibilities. Common role categories include individual contributors (perform specialized work), team leads (coordinate small groups), managers (oversee teams and projects), directors (set departmental strategy), and executives (C-suite: CEO, CFO, CTO — set organizational vision). The U.S. Department of Labor's Occupational Outlook Handbook categorizes thousands of occupations by industry, education requirements, and median pay.",
        source: "U.S. Department of Labor — Occupational Outlook Handbook",
      },
      {
        title: "Reporting Structures",
        content:
          "Reporting structures define who reports to whom. The most common structure is hierarchical: employees report to managers, managers to directors, directors to vice presidents, and VPs to the C-suite. Some organizations use flat structures (fewer management layers) or matrix structures (employees report to both a functional manager and a project manager). Harvard Business Review research shows that clear reporting lines reduce role ambiguity and improve decision-making speed.",
        source: "Harvard Business Review",
      },
    ],
  },
  {
    id: "m2",
    title: "Employment Fundamentals",
    objective: "Understand the basics of employment relationships.",
    icon: FileText,
    keyConcept: "Understanding the legal and professional framework of employment.",
    topics: [
      {
        title: "Types of Workers",
        content:
          "The IRS and Department of Labor distinguish several worker classifications: Employees receive regular wages, benefits, and tax withholding from their employer. Independent contractors operate their own business and control how work is performed. Interns work temporarily to gain experience — the Department of Labor's Fair Labor Standards Act (FLSA) defines criteria for unpaid internships at for-profit employers, including that the internship must primarily benefit the intern. Temporary workers are employed through staffing agencies for limited periods.",
        source: "U.S. Department of Labor — FLSA Intern Fact Sheet #71",
      },
      {
        title: "Employment Contracts",
        content:
          "An employment contract outlines the terms of the working relationship: job title, duties, compensation, benefits, work schedule, and termination conditions. In the United States, most employment is 'at-will,' meaning either party can end the relationship at any time for any lawful reason. Written offer letters typically specify start date, salary, reporting manager, and any contingencies such as background checks. The National Conference of State Legislatures (NCSL) provides state-by-state employment law resources.",
        source: "National Conference of State Legislatures (NCSL)",
      },
      {
        title: "Working Hours Expectations",
        content:
          "The Fair Labor Standards Act (FLSA) establishes a standard workweek of 40 hours. Non-exempt employees must receive overtime pay (1.5× regular rate) for hours exceeding 40 per week. Exempt employees (typically salaried professionals, executives, and administrators earning above a threshold) are not entitled to overtime. The Bureau of Labor Statistics reports that the average American works approximately 38.7 hours per week. Many employers now offer flexible scheduling, compressed workweeks, or remote work options.",
        source: "U.S. Department of Labor — FLSA",
      },
      {
        title: "Probation Periods",
        content:
          "Many employers establish a probationary period (typically 30–90 days) for new hires. During this time, performance is closely monitored, and either party can end the employment relationship more easily. Probation allows employers to assess fit and gives new employees time to demonstrate competence. SHRM surveys indicate that approximately 60% of organizations use some form of introductory period, during which benefits eligibility may also be limited.",
        source: "Society for Human Resource Management (SHRM)",
      },
      {
        title: "Confidentiality Agreements",
        content:
          "Confidentiality agreements (also called Non-Disclosure Agreements or NDAs) legally bind employees to protect sensitive company information — including trade secrets, client data, business strategies, and proprietary technology. The Uniform Trade Secrets Act (UTSA), adopted in most U.S. states, provides the legal framework for trade secret protection. Violating an NDA can result in termination, lawsuits, and financial penalties.",
        source: "Uniform Trade Secrets Act (UTSA)",
      },
    ],
  },
  {
    id: "m3",
    title: "Compensation and Payroll Basics",
    objective: "Understand how compensation works in professional environments.",
    icon: DollarSign,
    keyConcept: "Understanding how income from work is structured and processed.",
    topics: [
      {
        title: "Salary vs. Hourly Pay",
        content:
          "Salaried employees receive a fixed annual amount divided into regular pay periods regardless of hours worked. Hourly employees are paid for each hour worked and receive overtime for hours exceeding 40 per week. The Department of Labor's FLSA determines which employees qualify as exempt (salaried, no overtime) versus non-exempt (eligible for overtime). As of 2024, the salary threshold for overtime exemption is $35,568 per year ($684/week), though updates are regularly proposed.",
        source: "U.S. Department of Labor — FLSA Salary Threshold",
      },
      {
        title: "Pay Periods",
        content:
          "Pay periods define how frequently employees receive paychecks. Common frequencies include weekly (52 pay periods/year), bi-weekly (26 pay periods), semi-monthly (24 pay periods — typically the 1st and 15th), and monthly (12 pay periods). According to the Bureau of Labor Statistics, bi-weekly is the most common pay frequency in the U.S., used by approximately 43% of employers.",
        source: "Bureau of Labor Statistics",
      },
      {
        title: "Payroll Deductions",
        content:
          "Before employees receive their net (take-home) pay, several deductions are made from gross pay: federal income tax (based on W-4 withholding elections), state and local income taxes (varies by jurisdiction), Social Security tax (6.2% of gross pay up to the wage base), Medicare tax (1.45% of all gross pay), health insurance premiums, retirement contributions (401(k), 403(b)), and other voluntary deductions. The IRS provides Publication 15 (Circular E) as the employer's guide to tax withholding.",
        source: "IRS Publication 15 (Circular E)",
      },
      {
        title: "Taxes and Withholdings",
        content:
          "Federal income tax is calculated using a progressive bracket system — higher income is taxed at higher rates. For 2024, federal tax brackets range from 10% to 37%. FICA taxes fund Social Security and Medicare: employees pay 7.65% (6.2% Social Security + 1.45% Medicare), matched by the employer. State income taxes vary significantly — seven states (Alaska, Florida, Nevada, South Dakota, Tennessee, Texas, Wyoming) have no state income tax. The IRS W-4 form determines withholding amounts.",
        source: "Internal Revenue Service (IRS)",
      },
      {
        title: "Bonuses and Incentives",
        content:
          "Beyond base pay, employers may offer variable compensation: performance bonuses (tied to individual or company goals), signing bonuses (one-time payment upon hiring), profit-sharing (portion of company profits distributed to employees), stock options or equity grants (common in tech and startups), and commissions (percentage of sales revenue, common in sales roles). WorldatWork surveys indicate that over 80% of U.S. employers offer some form of variable pay.",
        source: "WorldatWork Total Rewards Survey",
      },
    ],
  },
  {
    id: "m4",
    title: "Workplace Policies and Professional Conduct",
    objective: "Understand expected professional behavior and workplace policies.",
    icon: Shield,
    keyConcept: "Understanding behavioral expectations in professional environments.",
    topics: [
      {
        title: "Code of Conduct",
        content:
          "A code of conduct is a formal document outlining an organization's values, ethical standards, and expected behaviors. It typically covers integrity, conflicts of interest, use of company resources, and regulatory compliance. The Ethics & Compliance Initiative (ECI) reports that organizations with well-communicated codes of conduct experience 57% fewer instances of misconduct. Employees are generally required to acknowledge and sign the code of conduct upon hiring.",
        source: "Ethics & Compliance Initiative (ECI)",
      },
      {
        title: "Workplace Ethics",
        content:
          "Workplace ethics involve applying moral principles to professional situations: honesty in reporting, fair treatment of colleagues, responsible use of company resources, avoiding conflicts of interest, and maintaining accountability. The Josephson Institute identifies six pillars of character in professional settings: trustworthiness, respect, responsibility, fairness, caring, and citizenship. Ethical behavior builds trust, protects the organization's reputation, and creates a positive work environment.",
        source: "Josephson Institute — Six Pillars of Character",
      },
      {
        title: "Anti-Harassment Policies",
        content:
          "Title VII of the Civil Rights Act of 1964 prohibits workplace harassment based on race, color, religion, sex, or national origin. The Equal Employment Opportunity Commission (EEOC) defines harassment as unwelcome conduct that creates a hostile work environment or results in adverse employment decisions. This includes sexual harassment (unwelcome sexual advances, requests for favors, or verbal/physical conduct of a sexual nature). Employers are legally required to take reasonable steps to prevent and address harassment.",
        source: "U.S. Equal Employment Opportunity Commission (EEOC)",
      },
      {
        title: "Professional Boundaries",
        content:
          "Professional boundaries define appropriate limits in workplace relationships. This includes maintaining appropriate physical and emotional boundaries with colleagues, separating personal and professional matters, respecting others' time and space, using appropriate language and communication channels, and understanding power dynamics (especially between supervisors and subordinates). The American Management Association emphasizes that clear boundaries contribute to a respectful, productive work environment.",
        source: "American Management Association (AMA)",
      },
      {
        title: "Workplace Communication Etiquette",
        content:
          "Professional communication follows established norms: use clear, respectful language; respond to messages within reasonable timeframes (typically 24 hours for email); be concise and purposeful; adapt your tone to the audience and channel; proofread before sending. The National Association of Colleges and Employers (NACE) identifies communication skills as the #1 competency employers seek in new hires, rating it above technical skills.",
        source: "National Association of Colleges and Employers (NACE)",
      },
    ],
  },
  {
    id: "m5",
    title: "Organizational Communication",
    objective: "Understand how communication happens inside organizations.",
    icon: MessageSquare,
    keyConcept: "Understanding structured professional communication.",
    topics: [
      {
        title: "Email Etiquette",
        content:
          "Professional email follows a structured format: a clear subject line summarizing the purpose, a professional greeting (Dear/Hi + name), concise body text with the key message in the first paragraph, a clear call to action or next steps, and a professional sign-off with signature. The Radicati Group reports that the average office worker sends and receives over 120 emails per day. Best practices include using CC sparingly, replying to all only when necessary, and avoiding emotional language.",
        source: "The Radicati Group — Email Statistics Report",
      },
      {
        title: "Workplace Messaging Platforms",
        content:
          "Modern workplaces use real-time messaging platforms (Slack, Microsoft Teams, Google Chat) for quick collaboration. These tools organize conversations into channels (by team, project, or topic), support direct messages, file sharing, and integrations with other tools. Gartner research indicates that 80% of workers use collaboration tools for work. Messaging etiquette includes keeping messages concise, using threads for detailed discussions, setting status indicators, and respecting colleagues' focus time.",
        source: "Gartner Research",
      },
      {
        title: "Meeting Etiquette",
        content:
          "Effective meetings require preparation and professionalism: arrive on time (or 1–2 minutes early), review the agenda beforehand, come prepared with relevant materials, listen actively, contribute constructively, keep comments concise and on-topic, mute when not speaking in virtual meetings, and follow up on action items. Harvard Business Review research shows that 71% of senior managers view meetings as unproductive — following meeting etiquette helps maximize everyone's time.",
        source: "Harvard Business Review",
      },
      {
        title: "Reporting Progress",
        content:
          "Regular progress reporting keeps stakeholders informed and demonstrates accountability. Common formats include daily standups (brief team check-ins covering what was done, what's planned, and blockers), weekly status reports (written summaries of accomplishments, upcoming tasks, and issues), and project dashboards (visual tracking of milestones and metrics). The Project Management Institute (PMI) identifies stakeholder communication as one of the top factors in project success.",
        source: "Project Management Institute (PMI)",
      },
      {
        title: "Asking for Clarification",
        content:
          "Seeking clarification is a professional skill, not a weakness. Effective techniques include paraphrasing what you understood and asking for confirmation, asking specific questions rather than vague ones ('What format should the report be in?' vs. 'Can you explain more?'), confirming deadlines and deliverables in writing, and following up after verbal conversations with a summary email. NACE research shows that employers value intellectual curiosity and the ability to ask thoughtful questions as key workplace competencies.",
        source: "National Association of Colleges and Employers (NACE)",
      },
    ],
  },
  {
    id: "m6",
    title: "Workplace Systems and Tools",
    objective: "Introduce the digital systems that organize modern work.",
    icon: Monitor,
    keyConcept: "Understanding the systems through which work is coordinated.",
    topics: [
      {
        title: "Messaging Platforms",
        content:
          "Workplace communication tools like Slack, Microsoft Teams, and Google Workspace enable real-time collaboration across distributed teams. These platforms support text messaging, voice and video calls, screen sharing, and file collaboration. Statista reports that Microsoft Teams reached over 320 million monthly active users in 2024. Key features include channels for organized topic-based discussions, integrations with project management and calendar tools, and searchable message histories.",
        source: "Statista — Microsoft Teams Usage Statistics",
      },
      {
        title: "Task Management Tools",
        content:
          "Task and project management tools (Asana, Trello, Jira, Monday.com, Notion) help teams plan, assign, track, and complete work. These tools typically offer boards (Kanban-style visual tracking), lists (structured task hierarchies), timelines (Gantt chart views), and automation features. The Project Management Institute reports that organizations using standardized project management practices waste 28 times less money than those without. Understanding these tools is essential for modern work coordination.",
        source: "Project Management Institute (PMI) — Pulse of the Profession",
      },
      {
        title: "File Sharing Systems",
        content:
          "Cloud-based file storage and sharing platforms (Google Drive, Microsoft OneDrive, Dropbox, SharePoint) enable teams to collaborate on documents in real time. Key concepts include version control (tracking changes and reverting to previous versions), access permissions (viewer, commenter, editor roles), shared folders and team drives, and file naming conventions. Gartner predicts that by 2025, 85% of organizations will adopt a cloud-first principle, making cloud file management a fundamental workplace skill.",
        source: "Gartner Research — Cloud Strategy",
      },
      {
        title: "Calendar and Meeting Scheduling",
        content:
          "Digital calendar tools (Google Calendar, Microsoft Outlook, Calendly) manage schedules, meetings, and deadlines. Professional calendar management includes blocking focus time for deep work, using meeting invitations with clear agendas and locations, setting appropriate meeting durations (default to 25 or 50 minutes instead of 30/60), managing time zones for remote teams, and using scheduling tools to avoid back-and-forth emails. The Harvard Business Review found that executives spend an average of 23 hours per week in meetings.",
        source: "Harvard Business Review — Meeting Time Study",
      },
    ],
  },
  {
    id: "m7",
    title: "Employee Rights and Workplace Safety",
    objective: "Understand fundamental employee protections.",
    icon: Scale,
    keyConcept: "Understanding basic workplace rights and protections.",
    topics: [
      {
        title: "Workplace Safety Principles",
        content:
          "The Occupational Safety and Health Act of 1970 established OSHA (Occupational Safety and Health Administration) to ensure safe working conditions. Under OSHA, employers must provide a workplace free from recognized hazards, provide safety training, maintain records of injuries and illnesses, and display OSHA posters informing workers of their rights. Employees have the right to request OSHA inspections, receive safety training, and report unsafe conditions without fear of retaliation. OSHA covers most private-sector employees in all 50 states.",
        source: "Occupational Safety and Health Administration (OSHA)",
      },
      {
        title: "Anti-Discrimination Protections",
        content:
          "Federal laws prohibit workplace discrimination based on protected characteristics: Title VII of the Civil Rights Act (race, color, religion, sex, national origin), Age Discrimination in Employment Act (age 40+), Americans with Disabilities Act (disability), Equal Pay Act (sex-based wage differences), and Genetic Information Nondiscrimination Act (genetic information). The EEOC enforces these laws and processed over 73,000 discrimination charges in fiscal year 2022. Employees who experience discrimination can file complaints with the EEOC.",
        source: "U.S. Equal Employment Opportunity Commission (EEOC)",
      },
      {
        title: "Reporting Workplace Issues",
        content:
          "Employees have multiple channels for reporting workplace concerns: direct supervisor or manager, Human Resources department, anonymous ethics hotlines (required for publicly traded companies under the Sarbanes-Oxley Act), OSHA (safety violations), EEOC (discrimination), and the Department of Labor (wage and hour violations). Whistleblower protections under federal and state laws prevent retaliation against employees who report illegal or unethical workplace practices in good faith.",
        source: "U.S. Department of Labor — Whistleblower Protection Program",
      },
      {
        title: "Respectful Workplace Standards",
        content:
          "A respectful workplace is one where all employees are treated with dignity regardless of position, background, or identity. Key principles include inclusive language, active listening, acknowledging diverse perspectives, avoiding microaggressions, and supporting colleagues' professional development. The Gallup State of the Global Workplace report found that employees who feel respected are 63% more satisfied with their jobs and 55% more engaged. Organizations increasingly adopt Diversity, Equity, and Inclusion (DEI) programs to foster respectful workplaces.",
        source: "Gallup — State of the Global Workplace Report",
      },
    ],
  },
];

const WorkplaceLiteracyBootcamp = () => {
  const navigate = useNavigate();
  const { saveProgress, getStep, loading } = useProgress();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});

  // Restore progress from saved metadata
  useEffect(() => {
    const step = getStep(BOOTCAMP_STEP);
    if (step?.metadata?.completedTopics) {
      setCompletedTopics(step.metadata.completedTopics as Record<string, boolean>);
    }
  }, [loading]);

  const totalTopics = modules.reduce((sum, m) => sum + m.topics.length, 0);
  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const overallProgress = Math.round((completedCount / totalTopics) * 100);

  const getModuleProgress = (mod: Module) => {
    const done = mod.topics.filter((_, i) => completedTopics[`${mod.id}-${i}`]).length;
    return { done, total: mod.topics.length, percent: Math.round((done / mod.topics.length) * 100) };
  };

  const toggleTopic = async (moduleId: string, topicIndex: number) => {
    const key = `${moduleId}-${topicIndex}`;
    const updated = { ...completedTopics, [key]: !completedTopics[key] };
    setCompletedTopics(updated);

    const newCount = Object.values(updated).filter(Boolean).length;
    const status = newCount === totalTopics ? "completed" : "in_progress";
    await saveProgress(BOOTCAMP_STEP, status, { completedTopics: updated });
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-accent" />
            <span className="text-xl font-bold">Internly</span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-xs gap-1">
              <Clock className="w-3 h-3" /> 4–6 hours · Self-paced
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              Skip for now
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <Button variant="ghost" size="sm" className="mb-4 text-muted-foreground" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Button>

        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Workplace Literacy Bootcamp</h1>
            <p className="text-muted-foreground mt-1">
              Pre-internship work readiness module — build essential structural knowledge of modern workplaces before beginning your simulation.
            </p>
          </div>
        </div>

        {/* Overall progress */}
        <div className="bg-card border border-border rounded-xl p-5 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{completedCount}/{totalTopics} topics</span>
          </div>
          <Progress value={overallProgress} className="h-2.5" />
          {overallProgress === 100 && (
            <p className="text-sm text-accent font-medium mt-2 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Bootcamp complete! You're ready for orientation.
            </p>
          )}
        </div>

        {/* Modules */}
        <div className="space-y-4">
          {modules.map((mod, modIdx) => {
            const Icon = mod.icon;
            const prog = getModuleProgress(mod);
            const isOpen = expandedModule === mod.id;

            return (
              <Collapsible key={mod.id} open={isOpen} onOpenChange={() => setExpandedModule(isOpen ? null : mod.id)}>
                <Card className="overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          prog.percent === 100 ? "bg-accent/15" : "bg-primary/10"
                        }`}>
                          {prog.percent === 100 ? (
                            <CheckCircle className="w-5 h-5 text-accent" />
                          ) : (
                            <Icon className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">
                              Module {modIdx + 1} — {mod.title}
                            </CardTitle>
                            {prog.percent === 100 && (
                              <Badge variant="secondary" className="text-[10px]">Complete</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{mod.objective}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Progress value={prog.percent} className="h-1.5 flex-1" />
                            <span className="text-xs text-muted-foreground shrink-0">{prog.done}/{prog.total}</span>
                          </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-4">
                      {/* Key concept */}
                      <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-sm">
                        <span className="font-semibold text-primary">Key Concept: </span>
                        <span className="text-foreground">{mod.keyConcept}</span>
                      </div>

                      {/* Topics */}
                      {mod.topics.map((topic, tIdx) => {
                        const topicKey = `${mod.id}-${tIdx}`;
                        const isDone = !!completedTopics[topicKey];

                        return (
                          <div key={topicKey} className="border border-border rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <Checkbox
                                id={topicKey}
                                checked={isDone}
                                onCheckedChange={() => toggleTopic(mod.id, tIdx)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <label
                                  htmlFor={topicKey}
                                  className={`font-medium text-sm cursor-pointer ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}
                                >
                                  {topic.title}
                                </label>
                                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                                  {topic.content}
                                </p>
                                {topic.source && (
                                  <p className="text-xs text-accent mt-2 flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" /> Source: {topic.source}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>

        {/* Bottom action */}
        <div className="mt-10 flex items-center justify-between">
          <Button variant="ghost" onClick={handleSkip}>
            Skip Bootcamp
          </Button>
          <Button
            variant="default"
            onClick={() => navigate("/dashboard")}
          >
            {overallProgress === 100 ? "Continue to Dashboard" : "Save & Return to Dashboard"}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkplaceLiteracyBootcamp;
