// Shared schedule generation for internship weeks

export interface EvaluationCriterion {
  name: string;
  description: string;
  weight: number; // 1-5
}

export interface TaskResource {
  label: string;
  url: string;
  type: "tool" | "reference" | "template" | "example" | "data";
  description: string;
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
  resources?: TaskResource[];
  backgroundInfo?: string;
  realCompanyReference?: {
    name: string;
    website: string;
    description: string;
    socialLinks?: { platform: string; url: string }[];
  };
  exampleData?: string[];
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
      backgroundInfo: "BrightWave Marketing is modeled on real mid-size creative agencies. Your onboarding mirrors the first-day experience at agencies like Ogilvy, Wieden+Kennedy, or VaynerMedia. The tools listed are industry-standard and free to set up.",
      resources: [
        { label: "Slack", url: "https://slack.com/get-started#/createnew", type: "tool", description: "Create a free Slack workspace to practice workplace messaging" },
        { label: "Asana", url: "https://asana.com/create-account", type: "tool", description: "Free project management tool — set up a board to track your tasks" },
        { label: "Google Workspace", url: "https://workspace.google.com/", type: "tool", description: "Use Google Docs, Sheets, and Slides for your deliverables (free with a Google account)" },
        { label: "Canva", url: "https://www.canva.com/signup", type: "tool", description: "Free design tool for creating marketing visuals and presentations" },
        { label: "HubSpot CRM", url: "https://www.hubspot.com/products/crm", type: "tool", description: "Free CRM platform — explore the marketing hub features" },
        { label: "What is a Brand Style Guide?", url: "https://blog.hubspot.com/marketing/branding-style-guide", type: "reference", description: "HubSpot's guide to understanding brand guidelines and tone of voice" },
        { label: "Marketing Agency Structure", url: "https://www.coursera.org/articles/marketing-agency", type: "reference", description: "Coursera article explaining how marketing agencies are structured" },
      ],
      exampleData: [
        "Example brand guideline elements: Logo usage rules, color palette (primary: #FF6B35, secondary: #004E89), typography (headings: Montserrat Bold, body: Open Sans), tone of voice (conversational, data-driven, empowering)",
        "Typical agency departments: Creative, Strategy, Account Management, Media Buying, Analytics, Social Media",
        "Common client industries for marketing agencies: Tech startups, e-commerce, health & wellness, financial services, real estate",
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
      backgroundInfo: "Case studies are how agencies showcase their work. Studying real-world campaign case studies will help you understand strategy, execution, and measurement. The links below are from real agencies and publications — all free to access.",
      resources: [
        { label: "Google Docs (for notes)", url: "https://docs.google.com/document/create", type: "tool", description: "Create a structured document for your orientation notes" },
        { label: "Ogilvy Case Studies", url: "https://www.ogilvy.com/work", type: "example", description: "Real campaign case studies from Ogilvy — study their strategy and results" },
        { label: "HubSpot Marketing Case Studies", url: "https://www.hubspot.com/case-studies", type: "example", description: "Free case studies showing real marketing campaign results and ROI" },
        { label: "Think with Google", url: "https://www.thinkwithgoogle.com/marketing-strategies/", type: "reference", description: "Google's marketing insights and real campaign breakdowns" },
        { label: "How to Take Effective Meeting Notes", url: "https://fellow.app/blog/meetings/how-to-take-meeting-notes/", type: "reference", description: "Best practices for capturing key points during meetings" },
        { label: "Marketing Role Overview (Indeed)", url: "https://www.indeed.com/career-advice/finding-a-job/what-does-marketing-associate-do", type: "reference", description: "Indeed's breakdown of marketing associate responsibilities" },
      ],
      exampleData: [
        "Key questions to ask during 1-on-1s: What are you working on right now? What tools do you use daily? What's the biggest challenge on your current project? How do you measure success?",
        "Meeting note structure: Date/Time, Attendees, Key Decisions, Action Items, Your Observations, Follow-up Questions",
        "Common marketing metrics discussed in status calls: CTR (Click-Through Rate), CPA (Cost Per Acquisition), ROAS (Return on Ad Spend), Engagement Rate, Conversion Rate",
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
      note: "Use the real companies below as stand-ins for FitLife Wellness. Audit their public social media profiles — all data is publicly accessible.",
      evaluationCriteria: [
        { name: "Research Quality", description: "Audit is based on actual data points — engagement metrics, posting patterns, and audience behavior", weight: 5 },
        { name: "Analytical Depth", description: "Goes beyond surface observations to identify trends and root causes", weight: 5 },
        { name: "Actionability", description: "Recommendations are specific, feasible, and tied to campaign goals", weight: 4 },
        { name: "Use of Data", description: "Includes concrete numbers, percentages, or comparisons to support claims", weight: 4 },
        { name: "Presentation & Structure", description: "Report is well-organized with clear sections and professional formatting", weight: 3 },
      ],
      backgroundInfo: "For this task, use real fitness & wellness brands as your reference companies. Their social media profiles are publicly accessible. Analyze their actual posts, engagement metrics (likes, comments, shares visible on each post), and content strategy. Below are real companies you can audit directly.",
      realCompanyReference: {
        name: "Peloton",
        website: "https://www.onepeloton.com",
        description: "Leading connected fitness company offering live and on-demand workouts — strong social media presence targeting young professionals.",
        socialLinks: [
          { platform: "Instagram", url: "https://www.instagram.com/onepeloton/" },
          { platform: "TikTok", url: "https://www.tiktok.com/@onepeloton" },
          { platform: "LinkedIn", url: "https://www.linkedin.com/company/peloton-interactive/" },
          { platform: "X (Twitter)", url: "https://x.com/onepeloton" },
        ],
      },
      resources: [
        { label: "Peloton Instagram", url: "https://www.instagram.com/onepeloton/", type: "data", description: "Audit this profile: check post types, engagement, captions, and hashtags" },
        { label: "Nike Training Instagram", url: "https://www.instagram.com/niketraining/", type: "data", description: "Secondary reference: Nike Training's content strategy for fitness audiences" },
        { label: "Headspace Instagram", url: "https://www.instagram.com/headspace/", type: "data", description: "Wellness brand example — strong visual branding and engagement" },
        { label: "Social Blade (Free Analytics)", url: "https://socialblade.com/", type: "tool", description: "Free tool to check follower growth, posting frequency, and engagement estimates" },
        { label: "Not Just Analytics", url: "https://www.notjustanalytics.com/", type: "tool", description: "Free Instagram analytics — check engagement rates, best posting times, hashtag performance" },
        { label: "Google Sheets (Audit Template)", url: "https://docs.google.com/spreadsheets/create", type: "template", description: "Create a spreadsheet to organize your audit data: platform, post type, engagement, date, notes" },
        { label: "Social Media Audit Guide (Hootsuite)", url: "https://blog.hootsuite.com/social-media-audit-template/", type: "reference", description: "Hootsuite's step-by-step social media audit guide with free template" },
        { label: "Buffer's Engagement Rate Calculator", url: "https://buffer.com/library/social-media-engagement-rate/", type: "reference", description: "How to calculate and benchmark engagement rates across platforms" },
      ],
      exampleData: [
        "Engagement Rate Formula: (Likes + Comments + Shares) / Followers × 100. Industry average for fitness: 1.5–3.5% on Instagram",
        "Content types to categorize: Reels/Videos, Carousels, Single Image, Stories, Text Posts, User-Generated Content (UGC)",
        "Audit spreadsheet columns: Post Date, Platform, Content Type, Caption Theme, Likes, Comments, Shares, Engagement Rate, Notes",
        "Hashtag categories to analyze: Branded (#PelotonCommunity), Industry (#FitnessMotivation), Niche (#DeskToFit), Trending",
        "Posting frequency benchmarks: Instagram 3-5x/week, LinkedIn 2-3x/week, TikTok 3-7x/week (source: Sprout Social 2024)",
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
      note: "Use the real competitor brands below. All their social media data is publicly accessible for analysis.",
      evaluationCriteria: [
        { name: "Competitor Identification", description: "Selected competitors are relevant direct competitors with justification", weight: 4 },
        { name: "Comparative Analysis", description: "Meaningful side-by-side comparison with specific metrics and examples", weight: 5 },
        { name: "Strategic Thinking", description: "Identifies actionable opportunities and competitive advantages", weight: 5 },
        { name: "Evidence-Based Claims", description: "All assertions backed by observable data or examples", weight: 4 },
        { name: "Clarity", description: "Brief is concise, well-structured, and easy to present", weight: 3 },
      ],
      backgroundInfo: "Use these three real fitness/wellness companies as your competitor set. Analyze their publicly visible social media profiles, website positioning, and content strategy. All information needed is free and publicly available.",
      realCompanyReference: {
        name: "Peloton (Primary Reference as 'FitLife')",
        website: "https://www.onepeloton.com",
        description: "Use Peloton as the stand-in for FitLife Wellness. Then compare it against the three competitors listed in resources below.",
        socialLinks: [
          { platform: "Instagram", url: "https://www.instagram.com/onepeloton/" },
        ],
      },
      resources: [
        { label: "Competitor 1: Noom", url: "https://www.instagram.com/noom/", type: "data", description: "Health & behavior change platform. Compare their content themes, engagement approach, and audience tone vs Peloton." },
        { label: "Noom Website", url: "https://www.noom.com", type: "data", description: "Review their positioning, messaging, and target audience" },
        { label: "Competitor 2: Gymshark", url: "https://www.instagram.com/gymshark/", type: "data", description: "Fitness apparel brand with massive social following. Study their UGC strategy and community building." },
        { label: "Gymshark Website", url: "https://www.gymshark.com", type: "data", description: "Review their brand voice, athlete partnerships, and community approach" },
        { label: "Competitor 3: Calm App", url: "https://www.instagram.com/calm/", type: "data", description: "Mental wellness app. Analyze their visual style, content mix, and how they target professionals." },
        { label: "Calm Website", url: "https://www.calm.com", type: "data", description: "Study their positioning in the wellness space and B2B offerings" },
        { label: "Social Blade (Compare accounts)", url: "https://socialblade.com/", type: "tool", description: "Compare follower counts, growth rates, and estimated engagement across all three competitors" },
        { label: "Google Sheets (Comparison Template)", url: "https://docs.google.com/spreadsheets/create", type: "template", description: "Create a side-by-side comparison: Brand, Followers, Engagement Rate, Content Mix, Strengths, Weaknesses" },
        { label: "Competitor Analysis Framework (HubSpot)", url: "https://blog.hubspot.com/marketing/competitive-analysis-kit", type: "reference", description: "Free competitor analysis template and methodology from HubSpot" },
        { label: "How to Do a Competitive Content Analysis", url: "https://contentmarketinginstitute.com/articles/competitive-content-analysis/", type: "reference", description: "Content Marketing Institute's guide to benchmarking competitor content" },
      ],
      exampleData: [
        "Comparison table columns: Brand Name, Instagram Followers, Avg. Engagement Rate, Primary Content Type, Posting Frequency, Unique Tactic, Weakness/Gap",
        "Approximate follower counts (verify live): Peloton ~3.8M IG, Gymshark ~7M IG, Noom ~800K IG, Calm ~3M IG",
        "Content categories to compare: Educational, Motivational, UGC, Product-focused, Behind-the-scenes, Community-driven, Influencer partnerships",
        "Questions to answer: Who has the highest engagement per post? Which brand reposts user content most? Who uses video vs. static more effectively?",
      ],
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
      evaluationCriteria: [
        { name: "Content Strategy Alignment", description: "Calendar directly supports the campaign goal and target audience", weight: 5 },
        { name: "Creativity & Variety", description: "Mix of content types shows creative thinking and platform awareness", weight: 4 },
        { name: "Completeness", description: "All 7 days covered with post type, caption, visual suggestion, and platform", weight: 5 },
        { name: "Integration of Research", description: "Competitor analysis insights are visibly incorporated", weight: 4 },
        { name: "Self-Reflection Quality", description: "Honest, specific reflection showing growth mindset", weight: 3 },
      ],
      backgroundInfo: "Content calendars are the backbone of social media marketing. Use the free templates and tools below to create a professional 7-day plan. Reference the Peloton/FitLife scenario from Days 3–4. All tools are free.",
      resources: [
        { label: "Canva Content Calendar Template", url: "https://www.canva.com/templates/search/content-calendar/", type: "template", description: "Free, professional content calendar templates you can customize for your submission" },
        { label: "Google Sheets Calendar Template", url: "https://docs.google.com/spreadsheets/create", type: "template", description: "Build your own: Day, Platform, Post Type, Caption, Visual Description, Hashtags, Goal Alignment" },
        { label: "Canva (Create Visuals)", url: "https://www.canva.com/", type: "tool", description: "Design mock social media post visuals — use Instagram Post, LinkedIn Post, or TikTok templates" },
        { label: "Unsplash (Free Stock Photos)", url: "https://unsplash.com/s/photos/fitness", type: "tool", description: "Free, high-quality fitness and wellness stock photos for visual suggestions" },
        { label: "Pexels (Free Stock Photos)", url: "https://www.pexels.com/search/fitness/", type: "tool", description: "Another free stock photo source — search fitness, wellness, productivity" },
        { label: "Later Blog: Content Calendar Guide", url: "https://later.com/blog/social-media-content-calendar/", type: "reference", description: "Step-by-step guide to building a content calendar from Later (social media tool)" },
        { label: "Hootsuite: Content Types Guide", url: "https://blog.hootsuite.com/social-media-content-strategy/", type: "reference", description: "Understanding different content types and when to use each one" },
        { label: "Instagram Best Practices 2024", url: "https://blog.hootsuite.com/instagram-marketing/", type: "reference", description: "Current best practices for Instagram marketing — formats, timing, and engagement" },
        { label: "LinkedIn Content Best Practices", url: "https://business.linkedin.com/marketing-solutions/blog/best-practices--content-marketing/2024/linkedin-content-best-practices", type: "reference", description: "LinkedIn's official content marketing best practices" },
      ],
      exampleData: [
        "Content calendar columns: Day (Mon-Sun), Platform, Post Type, Caption Draft (2-3 sentences), Visual Description, Hashtags (5-10), Content Theme, Goal Alignment",
        "Content theme ideas for fitness/wellness targeting young professionals: Monday Motivation, Wellness Wednesday, Quick Desk Exercises, Weekend Reset, Nutrition Tips, Success Stories, Behind-the-Scenes",
        "Post type mix recommendation: 2 Reels/Videos, 2 Carousels, 1 Single Image, 1 Story Series, 1 Text/Quote Post per week",
        "Best posting times for professionals 22-35 (source: Sprout Social): Instagram 11am-1pm & 7-9pm, LinkedIn 7-8am & 5-6pm, TikTok 6-9pm",
        "Self-reflection prompts: What was most challenging this week? What surprised you? Which task taught you the most? What would you do differently? What's one goal for Week 2?",
      ],
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
