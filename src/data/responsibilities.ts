// Key Responsibilities Pool — All Roles
// Responsibilities are grouped by role and category. The system selects a personalized
// subset based on internship duration, company persona, and manager style.

export interface Responsibility {
  id: string;
  role: string;
  category: string;
  text: string;
  companyAffinity: string[];
  managerAffinity: string[];
}

export const ALL_RESPONSIBILITIES: Responsibility[] = [
  // ═══════════════════════════════════════════════
  // MARKETING ASSOCIATE
  // ═══════════════════════════════════════════════

  // ── Campaign Management ──
  { id: "ma-cm-1", role: "marketing-associate", category: "Campaign Management", text: "Support the development and execution of marketing campaigns across digital and brand channels.", companyAffinity: ["brightwave", "nexora"], managerAffinity: ["supportive", "demanding"] },
  { id: "ma-cm-2", role: "marketing-associate", category: "Campaign Management", text: "Plan, launch, and manage campaigns to drive customer acquisition and engagement.", companyAffinity: ["nexora", "atlas-robotics"], managerAffinity: ["demanding", "detail-oriented"] },
  { id: "ma-cm-3", role: "marketing-associate", category: "Campaign Management", text: "Coordinate campaign launches across creative, product, sales, and operations teams.", companyAffinity: ["brightwave", "atlas-robotics"], managerAffinity: ["detail-oriented", "supportive"] },
  { id: "ma-cm-4", role: "marketing-associate", category: "Campaign Management", text: "Assist with go-to-market planning and product launch activities.", companyAffinity: ["nexora", "atlas-robotics"], managerAffinity: ["demanding"] },
  { id: "ma-cm-5", role: "marketing-associate", category: "Campaign Management", text: "Ensure campaigns align with brand strategy and business objectives.", companyAffinity: ["brightwave", "vividstyle"], managerAffinity: ["detail-oriented"] },

  // ── Content Creation & Messaging ──
  { id: "ma-cc-1", role: "marketing-associate", category: "Content Creation & Messaging", text: "Write and develop marketing content including emails, web copy, blog posts, case studies, presentations, and one-pagers.", companyAffinity: ["brightwave", "vividstyle"], managerAffinity: ["supportive", "detail-oriented"] },
  { id: "ma-cc-2", role: "marketing-associate", category: "Content Creation & Messaging", text: "Create messaging and storytelling materials that communicate the company's value proposition.", companyAffinity: ["brightwave", "nexora", "vividstyle"], managerAffinity: ["supportive"] },
  { id: "ma-cc-3", role: "marketing-associate", category: "Content Creation & Messaging", text: "Develop creative assets in collaboration with design teams.", companyAffinity: ["vividstyle", "brightwave", "pulseplay"], managerAffinity: ["supportive", "demanding"] },
  { id: "ma-cc-4", role: "marketing-associate", category: "Content Creation & Messaging", text: "Maintain editorial calendars and support ongoing content initiatives.", companyAffinity: ["brightwave", "vividstyle"], managerAffinity: ["detail-oriented"] },

  // ── Digital Marketing & Social Media ──
  { id: "ma-dm-1", role: "marketing-associate", category: "Digital Marketing & Social Media", text: "Manage and grow social media presence across platforms such as LinkedIn and emerging channels.", companyAffinity: ["brightwave", "vividstyle", "pulseplay"], managerAffinity: ["supportive", "demanding"] },
  { id: "ma-dm-2", role: "marketing-associate", category: "Digital Marketing & Social Media", text: "Support digital marketing initiatives including paid media, email campaigns, and online promotions.", companyAffinity: ["nexora", "brightwave"], managerAffinity: ["demanding", "detail-oriented"] },
  { id: "ma-dm-3", role: "marketing-associate", category: "Digital Marketing & Social Media", text: "Assist with experimentation and expansion into new marketing channels.", companyAffinity: ["nexora", "pulseplay"], managerAffinity: ["demanding"] },
  { id: "ma-dm-4", role: "marketing-associate", category: "Digital Marketing & Social Media", text: "Monitor engagement and optimize digital content strategies.", companyAffinity: ["brightwave", "vividstyle"], managerAffinity: ["detail-oriented"] },

  // ── Data Analysis & Performance Tracking ──
  { id: "ma-da-1", role: "marketing-associate", category: "Data Analysis & Performance Tracking", text: "Track marketing metrics and analyze campaign performance.", companyAffinity: ["nexora", "atlas-robotics", "brightwave"], managerAffinity: ["detail-oriented", "demanding"] },
  { id: "ma-da-2", role: "marketing-associate", category: "Data Analysis & Performance Tracking", text: "Build dashboards and generate performance reports.", companyAffinity: ["nexora", "atlas-robotics"], managerAffinity: ["detail-oriented"] },
  { id: "ma-da-3", role: "marketing-associate", category: "Data Analysis & Performance Tracking", text: "Analyze customer behavior, conversion trends, and funnel performance.", companyAffinity: ["nexora", "brightwave"], managerAffinity: ["detail-oriented", "demanding"] },
  { id: "ma-da-4", role: "marketing-associate", category: "Data Analysis & Performance Tracking", text: "Use insights to improve marketing efficiency and campaign outcomes.", companyAffinity: ["nexora", "atlas-robotics", "brightwave"], managerAffinity: ["demanding"] },

  // ── Lead Generation & Customer Acquisition ──
  { id: "ma-lg-1", role: "marketing-associate", category: "Lead Generation & Customer Acquisition", text: "Support sales teams with lead generation and account-based marketing initiatives.", companyAffinity: ["nexora", "atlas-robotics"], managerAffinity: ["demanding"] },
  { id: "ma-lg-2", role: "marketing-associate", category: "Lead Generation & Customer Acquisition", text: "Evaluate lead quality and traffic sources to improve acquisition performance.", companyAffinity: ["nexora", "brightwave"], managerAffinity: ["detail-oriented"] },
  { id: "ma-lg-3", role: "marketing-associate", category: "Lead Generation & Customer Acquisition", text: "Optimize targeting, bidding strategies, and marketing funnels.", companyAffinity: ["nexora", "brightwave"], managerAffinity: ["demanding", "detail-oriented"] },
  { id: "ma-lg-4", role: "marketing-associate", category: "Lead Generation & Customer Acquisition", text: "Help convert prospects into customers through marketing initiatives.", companyAffinity: ["nexora", "atlas-robotics", "brightwave"], managerAffinity: ["demanding", "supportive"] },

  // ── Cross-Functional Collaboration ──
  { id: "ma-cf-1", role: "marketing-associate", category: "Cross-Functional Collaboration", text: "Work closely with sales, product, design, engineering, and analytics teams.", companyAffinity: ["atlas-robotics", "nexora", "pulseplay"], managerAffinity: ["supportive", "demanding"] },
  { id: "ma-cf-2", role: "marketing-associate", category: "Cross-Functional Collaboration", text: "Coordinate marketing activities across departments.", companyAffinity: ["brightwave", "atlas-robotics"], managerAffinity: ["detail-oriented", "supportive"] },
  { id: "ma-cf-3", role: "marketing-associate", category: "Cross-Functional Collaboration", text: "Gather feedback from sales conversations, demos, and events to refine messaging.", companyAffinity: ["nexora", "atlas-robotics"], managerAffinity: ["detail-oriented"] },
  { id: "ma-cf-4", role: "marketing-associate", category: "Cross-Functional Collaboration", text: "Ensure alignment between marketing strategies and company goals.", companyAffinity: ["brightwave", "nexora", "atlas-robotics"], managerAffinity: ["demanding", "detail-oriented"] },

  // ── Events & External Engagement ──
  { id: "ma-ev-1", role: "marketing-associate", category: "Events & External Engagement", text: "Support marketing activities at conferences and industry events.", companyAffinity: ["atlas-robotics", "nexora"], managerAffinity: ["supportive"] },
  { id: "ma-ev-2", role: "marketing-associate", category: "Events & External Engagement", text: "Prepare event materials such as presentations and marketing collateral.", companyAffinity: ["brightwave", "atlas-robotics"], managerAffinity: ["detail-oriented", "supportive"] },
  { id: "ma-ev-3", role: "marketing-associate", category: "Events & External Engagement", text: "Assist with event follow-ups and relationship management.", companyAffinity: ["brightwave", "nexora"], managerAffinity: ["supportive"] },

  // ── Marketing Operations & Project Coordination ──
  { id: "ma-mo-1", role: "marketing-associate", category: "Marketing Operations & Project Coordination", text: "Maintain marketing budgets, trackers, and documentation systems.", companyAffinity: ["atlas-robotics", "brightwave"], managerAffinity: ["detail-oriented"] },
  { id: "ma-mo-2", role: "marketing-associate", category: "Marketing Operations & Project Coordination", text: "Manage timelines and ensure campaign deliverables are completed on schedule.", companyAffinity: ["brightwave", "nexora", "atlas-robotics"], managerAffinity: ["demanding", "detail-oriented"] },
  { id: "ma-mo-3", role: "marketing-associate", category: "Marketing Operations & Project Coordination", text: "Process vendor invoices and support marketing operations workflows.", companyAffinity: ["atlas-robotics", "brightwave"], managerAffinity: ["detail-oriented"] },
  { id: "ma-mo-4", role: "marketing-associate", category: "Marketing Operations & Project Coordination", text: "Improve marketing processes and operational efficiency.", companyAffinity: ["nexora", "atlas-robotics"], managerAffinity: ["demanding"] },

  // ═══════════════════════════════════════════════
  // BUSINESS ANALYST
  // ═══════════════════════════════════════════════

  // ── Requirements Gathering ──
  { id: "ba-rg-1", role: "business-analyst", category: "Requirements Gathering", text: "Conduct stakeholder interviews to elicit and document business requirements.", companyAffinity: ["nexora", "atlas-robotics"], managerAffinity: ["detail-oriented", "supportive"] },
  { id: "ba-rg-2", role: "business-analyst", category: "Requirements Gathering", text: "Facilitate requirements workshops and JAD sessions with cross-functional teams.", companyAffinity: ["atlas-robotics", "brightwave"], managerAffinity: ["demanding", "supportive"] },
  { id: "ba-rg-3", role: "business-analyst", category: "Requirements Gathering", text: "Translate business needs into clear functional and non-functional requirements.", companyAffinity: ["nexora", "atlas-robotics"], managerAffinity: ["detail-oriented"] },
  { id: "ba-rg-4", role: "business-analyst", category: "Requirements Gathering", text: "Maintain a requirements traceability matrix to track scope and changes.", companyAffinity: ["atlas-robotics"], managerAffinity: ["detail-oriented"] },

  // ── Process Analysis & Improvement ──
  { id: "ba-pa-1", role: "business-analyst", category: "Process Analysis & Improvement", text: "Map current-state business processes and identify inefficiencies.", companyAffinity: ["atlas-robotics", "nexora"], managerAffinity: ["detail-oriented", "demanding"] },
  { id: "ba-pa-2", role: "business-analyst", category: "Process Analysis & Improvement", text: "Design future-state process flows and recommend optimization strategies.", companyAffinity: ["nexora", "atlas-robotics"], managerAffinity: ["demanding"] },
  { id: "ba-pa-3", role: "business-analyst", category: "Process Analysis & Improvement", text: "Conduct gap analysis between current capabilities and desired outcomes.", companyAffinity: ["atlas-robotics", "brightwave"], managerAffinity: ["detail-oriented"] },
  { id: "ba-pa-4", role: "business-analyst", category: "Process Analysis & Improvement", text: "Create process documentation including swimlane diagrams and workflow specifications.", companyAffinity: ["atlas-robotics", "nexora"], managerAffinity: ["detail-oriented", "supportive"] },

  // ── Data Analysis & Reporting ──
  { id: "ba-da-1", role: "business-analyst", category: "Data Analysis & Reporting", text: "Analyze business data to identify trends, patterns, and actionable insights.", companyAffinity: ["nexora", "atlas-robotics"], managerAffinity: ["detail-oriented", "demanding"] },
  { id: "ba-da-2", role: "business-analyst", category: "Data Analysis & Reporting", text: "Build reports and dashboards to track KPIs and business performance metrics.", companyAffinity: ["nexora", "brightwave"], managerAffinity: ["detail-oriented"] },
  { id: "ba-da-3", role: "business-analyst", category: "Data Analysis & Reporting", text: "Perform cost-benefit analysis for proposed solutions and initiatives.", companyAffinity: ["atlas-robotics", "nexora"], managerAffinity: ["demanding"] },
  { id: "ba-da-4", role: "business-analyst", category: "Data Analysis & Reporting", text: "Present data-driven recommendations to leadership and key stakeholders.", companyAffinity: ["nexora", "brightwave", "atlas-robotics"], managerAffinity: ["demanding", "supportive"] },

  // ── Stakeholder Communication ──
  { id: "ba-sc-1", role: "business-analyst", category: "Stakeholder Communication", text: "Prepare executive-level presentations and business case documents.", companyAffinity: ["nexora", "brightwave"], managerAffinity: ["demanding", "detail-oriented"] },
  { id: "ba-sc-2", role: "business-analyst", category: "Stakeholder Communication", text: "Facilitate meetings between technical teams and business stakeholders.", companyAffinity: ["atlas-robotics", "nexora"], managerAffinity: ["supportive"] },
  { id: "ba-sc-3", role: "business-analyst", category: "Stakeholder Communication", text: "Document meeting outcomes, action items, and decision logs.", companyAffinity: ["atlas-robotics", "brightwave"], managerAffinity: ["detail-oriented"] },
  { id: "ba-sc-4", role: "business-analyst", category: "Stakeholder Communication", text: "Manage stakeholder expectations and communicate project status updates.", companyAffinity: ["nexora", "atlas-robotics", "brightwave"], managerAffinity: ["supportive", "demanding"] },

  // ── Solution Design & Validation ──
  { id: "ba-sd-1", role: "business-analyst", category: "Solution Design & Validation", text: "Evaluate potential solutions against business criteria and constraints.", companyAffinity: ["atlas-robotics", "nexora"], managerAffinity: ["detail-oriented", "demanding"] },
  { id: "ba-sd-2", role: "business-analyst", category: "Solution Design & Validation", text: "Define acceptance criteria and support user acceptance testing (UAT).", companyAffinity: ["atlas-robotics", "nexora"], managerAffinity: ["detail-oriented"] },
  { id: "ba-sd-3", role: "business-analyst", category: "Solution Design & Validation", text: "Create wireframes and prototypes to communicate proposed solutions.", companyAffinity: ["nexora", "brightwave", "pulseplay"], managerAffinity: ["supportive"] },
  { id: "ba-sd-4", role: "business-analyst", category: "Solution Design & Validation", text: "Validate implemented solutions against original requirements and specifications.", companyAffinity: ["atlas-robotics"], managerAffinity: ["detail-oriented", "demanding"] },

  // ── Project Support & Coordination ──
  { id: "ba-ps-1", role: "business-analyst", category: "Project Support & Coordination", text: "Support project managers with scope definition, planning, and risk tracking.", companyAffinity: ["atlas-robotics", "nexora"], managerAffinity: ["demanding", "detail-oriented"] },
  { id: "ba-ps-2", role: "business-analyst", category: "Project Support & Coordination", text: "Assist in sprint planning and backlog grooming in Agile environments.", companyAffinity: ["nexora", "pulseplay"], managerAffinity: ["demanding"] },
  { id: "ba-ps-3", role: "business-analyst", category: "Project Support & Coordination", text: "Coordinate cross-functional teams to resolve dependencies and blockers.", companyAffinity: ["atlas-robotics", "brightwave"], managerAffinity: ["supportive", "demanding"] },

  // ── Research & Benchmarking ──
  { id: "ba-rb-1", role: "business-analyst", category: "Research & Benchmarking", text: "Conduct industry research and competitive benchmarking to inform strategy.", companyAffinity: ["nexora", "brightwave"], managerAffinity: ["detail-oriented", "supportive"] },
  { id: "ba-rb-2", role: "business-analyst", category: "Research & Benchmarking", text: "Research best practices and emerging tools to improve analytical workflows.", companyAffinity: ["nexora", "atlas-robotics"], managerAffinity: ["supportive"] },
  { id: "ba-rb-3", role: "business-analyst", category: "Research & Benchmarking", text: "Analyze market trends to identify opportunities and threats for the business.", companyAffinity: ["nexora", "brightwave", "atlas-robotics"], managerAffinity: ["demanding"] },

  // ═══════════════════════════════════════════════
  // OPERATIONS ASSISTANT
  // ═══════════════════════════════════════════════

  // ── Process Management & Documentation ──
  { id: "oa-pm-1", role: "operations-assistant", category: "Process Management & Documentation", text: "Document standard operating procedures (SOPs) for key business processes.", companyAffinity: ["atlas-robotics", "nexora"], managerAffinity: ["detail-oriented"] },
  { id: "oa-pm-2", role: "operations-assistant", category: "Process Management & Documentation", text: "Map end-to-end workflows and identify bottlenecks in daily operations.", companyAffinity: ["atlas-robotics", "nexora"], managerAffinity: ["detail-oriented", "demanding"] },
  { id: "oa-pm-3", role: "operations-assistant", category: "Process Management & Documentation", text: "Propose and implement process improvements to increase team efficiency.", companyAffinity: ["nexora", "atlas-robotics"], managerAffinity: ["demanding"] },
  { id: "oa-pm-4", role: "operations-assistant", category: "Process Management & Documentation", text: "Maintain and update internal knowledge base and documentation systems.", companyAffinity: ["atlas-robotics", "brightwave"], managerAffinity: ["detail-oriented", "supportive"] },

  // ── Scheduling & Logistics ──
  { id: "oa-sl-1", role: "operations-assistant", category: "Scheduling & Logistics", text: "Manage team calendars, meeting schedules, and room bookings.", companyAffinity: ["brightwave", "atlas-robotics"], managerAffinity: ["supportive", "detail-oriented"] },
  { id: "oa-sl-2", role: "operations-assistant", category: "Scheduling & Logistics", text: "Coordinate logistics for team events, travel, and offsite meetings.", companyAffinity: ["brightwave", "nexora"], managerAffinity: ["supportive"] },
  { id: "oa-sl-3", role: "operations-assistant", category: "Scheduling & Logistics", text: "Optimize scheduling workflows to minimize conflicts and maximize productivity.", companyAffinity: ["nexora", "atlas-robotics"], managerAffinity: ["demanding", "detail-oriented"] },
  { id: "oa-sl-4", role: "operations-assistant", category: "Scheduling & Logistics", text: "Track deliverable deadlines and send reminders to keep projects on schedule.", companyAffinity: ["atlas-robotics", "brightwave", "nexora"], managerAffinity: ["demanding"] },

  // ── Data Entry & Record Keeping ──
  { id: "oa-de-1", role: "operations-assistant", category: "Data Entry & Record Keeping", text: "Perform accurate data entry and maintain up-to-date records in company systems.", companyAffinity: ["atlas-robotics", "nexora"], managerAffinity: ["detail-oriented"] },
  { id: "oa-de-2", role: "operations-assistant", category: "Data Entry & Record Keeping", text: "Reconcile data across multiple systems and resolve discrepancies.", companyAffinity: ["nexora", "atlas-robotics"], managerAffinity: ["detail-oriented", "demanding"] },
  { id: "oa-de-3", role: "operations-assistant", category: "Data Entry & Record Keeping", text: "Generate operational reports from internal databases and tracking tools.", companyAffinity: ["nexora", "atlas-robotics", "brightwave"], managerAffinity: ["detail-oriented"] },
  { id: "oa-de-4", role: "operations-assistant", category: "Data Entry & Record Keeping", text: "Ensure data integrity and compliance with organizational data standards.", companyAffinity: ["atlas-robotics"], managerAffinity: ["detail-oriented", "demanding"] },

  // ── Inventory & Vendor Management ──
  { id: "oa-iv-1", role: "operations-assistant", category: "Inventory & Vendor Management", text: "Track inventory levels and coordinate restocking with suppliers.", companyAffinity: ["atlas-robotics", "vividstyle"], managerAffinity: ["detail-oriented"] },
  { id: "oa-iv-2", role: "operations-assistant", category: "Inventory & Vendor Management", text: "Manage vendor relationships, contracts, and service level agreements.", companyAffinity: ["atlas-robotics", "brightwave"], managerAffinity: ["demanding", "detail-oriented"] },
  { id: "oa-iv-3", role: "operations-assistant", category: "Inventory & Vendor Management", text: "Process purchase orders, invoices, and expense reports.", companyAffinity: ["atlas-robotics", "nexora"], managerAffinity: ["detail-oriented"] },
  { id: "oa-iv-4", role: "operations-assistant", category: "Inventory & Vendor Management", text: "Evaluate vendor performance and recommend cost-saving alternatives.", companyAffinity: ["nexora", "atlas-robotics"], managerAffinity: ["demanding"] },

  // ── Team Support & Coordination ──
  { id: "oa-ts-1", role: "operations-assistant", category: "Team Support & Coordination", text: "Support cross-functional teams with administrative and operational tasks.", companyAffinity: ["brightwave", "atlas-robotics", "nexora"], managerAffinity: ["supportive"] },
  { id: "oa-ts-2", role: "operations-assistant", category: "Team Support & Coordination", text: "Prepare meeting agendas, take minutes, and track follow-up action items.", companyAffinity: ["atlas-robotics", "brightwave"], managerAffinity: ["detail-oriented", "supportive"] },
  { id: "oa-ts-3", role: "operations-assistant", category: "Team Support & Coordination", text: "Onboard new team members by preparing workspaces, accounts, and orientation materials.", companyAffinity: ["brightwave", "nexora"], managerAffinity: ["supportive"] },
  { id: "oa-ts-4", role: "operations-assistant", category: "Team Support & Coordination", text: "Serve as a point of contact for internal queries and operational requests.", companyAffinity: ["brightwave", "atlas-robotics"], managerAffinity: ["supportive", "demanding"] },

  // ── Operational Analysis & Reporting ──
  { id: "oa-oa-1", role: "operations-assistant", category: "Operational Analysis & Reporting", text: "Analyze operational data to identify trends and improvement opportunities.", companyAffinity: ["nexora", "atlas-robotics"], managerAffinity: ["detail-oriented", "demanding"] },
  { id: "oa-oa-2", role: "operations-assistant", category: "Operational Analysis & Reporting", text: "Build and maintain operational dashboards and KPI tracking systems.", companyAffinity: ["nexora", "atlas-robotics"], managerAffinity: ["detail-oriented"] },
  { id: "oa-oa-3", role: "operations-assistant", category: "Operational Analysis & Reporting", text: "Prepare weekly and monthly operational performance reports for management.", companyAffinity: ["atlas-robotics", "brightwave", "nexora"], managerAffinity: ["demanding", "detail-oriented"] },

  // ── Quality & Compliance ──
  { id: "oa-qc-1", role: "operations-assistant", category: "Quality & Compliance", text: "Support quality assurance processes and audit preparation activities.", companyAffinity: ["atlas-robotics"], managerAffinity: ["detail-oriented"] },
  { id: "oa-qc-2", role: "operations-assistant", category: "Quality & Compliance", text: "Ensure operations comply with company policies and regulatory requirements.", companyAffinity: ["atlas-robotics", "nexora"], managerAffinity: ["detail-oriented", "demanding"] },
  { id: "oa-qc-3", role: "operations-assistant", category: "Quality & Compliance", text: "Track and resolve operational issues, escalating when necessary.", companyAffinity: ["atlas-robotics", "brightwave"], managerAffinity: ["demanding", "supportive"] },

  // ── Tools & Automation ──
  { id: "oa-ta-1", role: "operations-assistant", category: "Tools & Automation", text: "Identify repetitive tasks and propose automation solutions using tools like Zapier or scripts.", companyAffinity: ["nexora", "atlas-robotics"], managerAffinity: ["demanding"] },
  { id: "oa-ta-2", role: "operations-assistant", category: "Tools & Automation", text: "Set up and maintain project management tools (Asana, Notion, Trello) for the team.", companyAffinity: ["brightwave", "nexora", "pulseplay"], managerAffinity: ["supportive", "detail-oriented"] },
  { id: "oa-ta-3", role: "operations-assistant", category: "Tools & Automation", text: "Streamline communication workflows and reduce manual handoffs between teams.", companyAffinity: ["nexora", "atlas-robotics"], managerAffinity: ["demanding", "detail-oriented"] },
];

/** Number of responsibilities by duration (weeks). */
const RESPONSIBILITY_COUNT: Record<number, number> = {
  2: 4,
  4: 6,
  6: 7,
  8: 8,
  12: 10,
};

/**
 * Select personalized responsibilities for any role based on duration, company, and manager style.
 * Uses a scoring + seeded-shuffle approach so the same user gets variety while
 * still being weighted toward their company/manager affinity.
 */
export function selectResponsibilities(
  roleId: string,
  durationWeeks: number,
  companyId: string,
  managerStyle: string,
  seed?: string,
): Responsibility[] {
  const count = RESPONSIBILITY_COUNT[durationWeeks] ?? 6;

  // Filter to the correct role
  const rolePool = ALL_RESPONSIBILITIES.filter((r) => r.role === roleId);
  if (rolePool.length === 0) return [];

  // Score each responsibility
  const scored = rolePool.map((r) => {
    let score = 0;
    if (r.companyAffinity.includes(companyId)) score += 2;
    if (r.managerAffinity.includes(managerStyle)) score += 1;
    return { ...r, score };
  });

  // Sort by score descending, then add deterministic variety via seed
  const seededRandom = createSeededRandom(seed || "default");
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return seededRandom() - 0.5;
  });

  // Ensure category diversity: pick from different categories first
  const selected: Responsibility[] = [];
  const usedCategories = new Set<string>();
  const remaining: typeof scored = [];

  for (const r of scored) {
    if (selected.length >= count) break;
    if (!usedCategories.has(r.category)) {
      selected.push(r);
      usedCategories.add(r.category);
    } else {
      remaining.push(r);
    }
  }

  for (const r of remaining) {
    if (selected.length >= count) break;
    selected.push(r);
  }

  return selected;
}

/** Simple seeded PRNG (mulberry32). */
function createSeededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return () => {
    h |= 0;
    h = h + 0x6d2b79f5 | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
