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
