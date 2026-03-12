// Shared schedule generation for internship weeks

export interface EvaluationCriterion {
  name: string;
  description: string;
  weight: number; // 1-5
}

export interface DailyTask {
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
  evaluationCriteria?: EvaluationCriterion[];
}

export interface WeekSchedule {
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
export const detailedDailyTasks: Record<string, DailyTask[]> = {
  "marketing-associate:brightwave:week1": [
    {
      day: 1,
      title: "Welcome & Company Orientation",
      deliverable: "Completed Onboarding Checklist",
      deliverableDetails: [
        "Attend the 9:30 AM all-hands welcome session with your manager and team leads",
        "Complete HR onboarding paperwork and review the employee handbook",
        "Set up your workstation: Slack, Asana, Google Workspace, Canva, and HubSpot accounts",
        "Review BrightWave's brand guidelines, tone-of-voice document, and style guide",
        "Familiarize yourself with the client portfolio — read the overview deck in the shared drive",
      ],
      deadline: "End of day — confirm completion with your manager via Slack",
      note: "No deliverable submission today. Focus on absorbing information and getting comfortable with the team.",
      evaluationCriteria: [
        { name: "Completeness", description: "All onboarding items addressed and confirmed", weight: 5 },
        { name: "Attention to Detail", description: "Demonstrates thorough review of brand guidelines and company materials", weight: 3 },
        { name: "Professionalism", description: "Communication tone and formatting are workplace-appropriate", weight: 2 },
      ],
    },
    {
      day: 2,
      title: "Team Immersion & Role Briefing",
      deliverable: "Role Orientation Notes",
      deliverableDetails: [
        "Shadow your manager during a client status call to observe campaign discussions",
        "Meet 1-on-1 with each team member to understand their role and current projects",
        "Review 2–3 recent campaign case studies from the BrightWave portfolio",
        "Attend the marketing team's weekly planning meeting and take notes",
        "Write a brief summary of your key takeaways from the day and share with your manager",
      ],
      deadline: "5:00 PM — submit your orientation notes via Slack DM to your manager",
      note: "Ask questions freely today — this is your chance to understand how the team operates.",
      evaluationCriteria: [
        { name: "Clarity of Observations", description: "Key takeaways are clearly articulated and well-organized", weight: 4 },
        { name: "Depth of Understanding", description: "Notes show genuine comprehension of team dynamics and workflows", weight: 4 },
        { name: "Actionable Insights", description: "Identifies specific areas where they can contribute", weight: 3 },
        { name: "Professional Writing", description: "Grammar, structure, and tone are workplace-ready", weight: 2 },
      ],
    },
    {
      day: 3,
      title: "Social Media Marketing Audit",
      client: "FitLife Wellness",
      clientIndustry: "Fitness & Wellness",
      clientProducts: "Online fitness coaching and wellness programs",
      campaignGoal: "Increase engagement and brand awareness among young professionals interested in health and fitness.",
      targetAudience: "Professionals aged 22–35 who are interested in improving their health, productivity, and lifestyle.",
      platforms: ["Instagram", "LinkedIn", "TikTok or X"],
      analysisAreas: ["Content type", "Engagement levels", "Posting frequency", "Audience interaction"],
      identifyItems: ["The best performing posts", "The weak performing posts", "Any content gaps in the current content strategy"],
      deliverable: "Social Media Audit Report",
      deliverableDetails: [
        "The top 3 performing posts",
        "Key engagement patterns",
        "Suggested improvements to strengthen the client's social media strategy",
        "Two recommended content ideas that could improve engagement in the next phase of the campaign",
      ],
      deadline: "5:00 PM — to be reviewed during tomorrow's team check-in",
      note: "Let your manager know if you need clarification before getting started.",
      evaluationCriteria: [
        { name: "Research Quality", description: "Audit is based on actual data points — engagement metrics, posting patterns, and audience behavior", weight: 5 },
        { name: "Analytical Depth", description: "Goes beyond surface observations to identify trends and root causes", weight: 5 },
        { name: "Actionability", description: "Recommendations are specific, feasible, and tied to campaign goals", weight: 4 },
        { name: "Use of Data", description: "Includes concrete numbers, percentages, or comparisons to support claims", weight: 4 },
        { name: "Presentation & Structure", description: "Report is well-organized with clear sections and professional formatting", weight: 3 },
      ],
    },
    {
      day: 4,
      title: "Competitor Analysis & Content Benchmarking",
      client: "FitLife Wellness",
      clientIndustry: "Fitness & Wellness",
      campaignGoal: "Understand FitLife's competitive landscape and identify content opportunities.",
      deliverable: "Competitor Benchmarking Brief",
      deliverableDetails: [
        "Identify 3 direct competitors of FitLife Wellness and analyze their social media presence",
        "Compare content themes, posting frequency, engagement rates, and follower growth",
        "Highlight 2–3 tactics competitors use that FitLife could adapt or improve upon",
        "Note any gaps in competitor strategies that represent opportunities for FitLife",
      ],
      deadline: "4:00 PM — present findings during the afternoon team huddle",
      note: "Use the audit from Day 3 as your baseline for comparison.",
    },
    {
      day: 5,
      title: "Content Calendar Draft & Week 1 Recap",
      client: "FitLife Wellness",
      campaignGoal: "Translate audit insights and competitor research into an actionable content plan.",
      deliverable: "Draft Content Calendar (Week 1 of Campaign)",
      deliverableDetails: [
        "Create a 7-day content calendar for FitLife Wellness across Instagram, LinkedIn, and one additional platform",
        "Include post type (carousel, reel, story, text post), caption drafts, and suggested visuals",
        "Align content themes with the campaign goal of reaching young professionals",
        "Incorporate at least one content idea inspired by your competitor analysis",
        "Submit your Week 1 self-reflection (key learnings, challenges, and goals for Week 2)",
      ],
      deadline: "3:00 PM — submit via Asana; weekly status report due by 3:00 PM per company policy",
      note: "Your manager will review the calendar and provide feedback at the start of Week 2.",
    },
  ],
};

export const groupTasksByWeek: Record<number, string> = {
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

export const assignedRolesByWeek: Record<number, string> = {
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

export const generateSchedule = (weeks: number, roleTitle: string, roleId?: string, companyId?: string): WeekSchedule[] => {
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
    const groupTask = groupTasksByWeek[w.week] || "Group Collaboration Task";
    return {
      ...w,
      items: [...w.items, `📋 Group Task: ${groupTask}`],
      groupTask,
      zoomLink: `https://zoom.us/j/internly-week-${w.week}-${Date.now().toString(36).slice(-4)}`,
      assignedRole: assignedRolesByWeek[w.week] || "Contributor",
      dailyTasks: dailyTaskKey ? detailedDailyTasks[dailyTaskKey] : undefined,
    };
  });
};
