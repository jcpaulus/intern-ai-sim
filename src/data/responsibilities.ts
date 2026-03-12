// Marketing Associate — Key Responsibilities Pool
// Responsibilities are grouped into categories. The system selects a personalized
// subset based on internship duration, company persona, and manager style.

export interface Responsibility {
  id: string;
  category: string;
  text: string;
  /** Which company personas weight this responsibility higher */
  companyAffinity: string[];
  /** Which manager styles weight this responsibility higher */
  managerAffinity: string[];
}

export const RESPONSIBILITY_CATEGORIES = [
  "Campaign Management",
  "Content Creation & Messaging",
  "Digital Marketing & Social Media",
  "Data Analysis & Performance Tracking",
  "Lead Generation & Customer Acquisition",
  "Cross-Functional Collaboration",
  "Events & External Engagement",
  "Marketing Operations & Project Coordination",
] as const;

export const ALL_RESPONSIBILITIES: Responsibility[] = [
  // ── Campaign Management ──
  {
    id: "cm-1",
    category: "Campaign Management",
    text: "Support the development and execution of marketing campaigns across digital and brand channels.",
    companyAffinity: ["brightwave", "nexora"],
    managerAffinity: ["supportive", "demanding"],
  },
  {
    id: "cm-2",
    category: "Campaign Management",
    text: "Plan, launch, and manage campaigns to drive customer acquisition and engagement.",
    companyAffinity: ["nexora", "atlas-robotics"],
    managerAffinity: ["demanding", "detail-oriented"],
  },
  {
    id: "cm-3",
    category: "Campaign Management",
    text: "Coordinate campaign launches across creative, product, sales, and operations teams.",
    companyAffinity: ["brightwave", "atlas-robotics"],
    managerAffinity: ["detail-oriented", "supportive"],
  },
  {
    id: "cm-4",
    category: "Campaign Management",
    text: "Assist with go-to-market planning and product launch activities.",
    companyAffinity: ["nexora", "atlas-robotics"],
    managerAffinity: ["demanding"],
  },
  {
    id: "cm-5",
    category: "Campaign Management",
    text: "Ensure campaigns align with brand strategy and business objectives.",
    companyAffinity: ["brightwave", "vividstyle"],
    managerAffinity: ["detail-oriented"],
  },

  // ── Content Creation & Messaging ──
  {
    id: "cc-1",
    category: "Content Creation & Messaging",
    text: "Write and develop marketing content including emails, web copy, blog posts, case studies, presentations, and one-pagers.",
    companyAffinity: ["brightwave", "vividstyle"],
    managerAffinity: ["supportive", "detail-oriented"],
  },
  {
    id: "cc-2",
    category: "Content Creation & Messaging",
    text: "Create messaging and storytelling materials that communicate the company's value proposition.",
    companyAffinity: ["brightwave", "nexora", "vividstyle"],
    managerAffinity: ["supportive"],
  },
  {
    id: "cc-3",
    category: "Content Creation & Messaging",
    text: "Develop creative assets in collaboration with design teams.",
    companyAffinity: ["vividstyle", "brightwave", "pulseplay"],
    managerAffinity: ["supportive", "demanding"],
  },
  {
    id: "cc-4",
    category: "Content Creation & Messaging",
    text: "Maintain editorial calendars and support ongoing content initiatives.",
    companyAffinity: ["brightwave", "vividstyle"],
    managerAffinity: ["detail-oriented"],
  },

  // ── Digital Marketing & Social Media ──
  {
    id: "dm-1",
    category: "Digital Marketing & Social Media",
    text: "Manage and grow social media presence across platforms such as LinkedIn and emerging channels.",
    companyAffinity: ["brightwave", "vividstyle", "pulseplay"],
    managerAffinity: ["supportive", "demanding"],
  },
  {
    id: "dm-2",
    category: "Digital Marketing & Social Media",
    text: "Support digital marketing initiatives including paid media, email campaigns, and online promotions.",
    companyAffinity: ["nexora", "brightwave"],
    managerAffinity: ["demanding", "detail-oriented"],
  },
  {
    id: "dm-3",
    category: "Digital Marketing & Social Media",
    text: "Assist with experimentation and expansion into new marketing channels.",
    companyAffinity: ["nexora", "pulseplay"],
    managerAffinity: ["demanding"],
  },
  {
    id: "dm-4",
    category: "Digital Marketing & Social Media",
    text: "Monitor engagement and optimize digital content strategies.",
    companyAffinity: ["brightwave", "vividstyle"],
    managerAffinity: ["detail-oriented"],
  },

  // ── Data Analysis & Performance Tracking ──
  {
    id: "da-1",
    category: "Data Analysis & Performance Tracking",
    text: "Track marketing metrics and analyze campaign performance.",
    companyAffinity: ["nexora", "atlas-robotics", "brightwave"],
    managerAffinity: ["detail-oriented", "demanding"],
  },
  {
    id: "da-2",
    category: "Data Analysis & Performance Tracking",
    text: "Build dashboards and generate performance reports.",
    companyAffinity: ["nexora", "atlas-robotics"],
    managerAffinity: ["detail-oriented"],
  },
  {
    id: "da-3",
    category: "Data Analysis & Performance Tracking",
    text: "Analyze customer behavior, conversion trends, and funnel performance.",
    companyAffinity: ["nexora", "brightwave"],
    managerAffinity: ["detail-oriented", "demanding"],
  },
  {
    id: "da-4",
    category: "Data Analysis & Performance Tracking",
    text: "Use insights to improve marketing efficiency and campaign outcomes.",
    companyAffinity: ["nexora", "atlas-robotics", "brightwave"],
    managerAffinity: ["demanding"],
  },

  // ── Lead Generation & Customer Acquisition ──
  {
    id: "lg-1",
    category: "Lead Generation & Customer Acquisition",
    text: "Support sales teams with lead generation and account-based marketing initiatives.",
    companyAffinity: ["nexora", "atlas-robotics"],
    managerAffinity: ["demanding"],
  },
  {
    id: "lg-2",
    category: "Lead Generation & Customer Acquisition",
    text: "Evaluate lead quality and traffic sources to improve acquisition performance.",
    companyAffinity: ["nexora", "brightwave"],
    managerAffinity: ["detail-oriented"],
  },
  {
    id: "lg-3",
    category: "Lead Generation & Customer Acquisition",
    text: "Optimize targeting, bidding strategies, and marketing funnels.",
    companyAffinity: ["nexora", "brightwave"],
    managerAffinity: ["demanding", "detail-oriented"],
  },
  {
    id: "lg-4",
    category: "Lead Generation & Customer Acquisition",
    text: "Help convert prospects into customers through marketing initiatives.",
    companyAffinity: ["nexora", "atlas-robotics", "brightwave"],
    managerAffinity: ["demanding", "supportive"],
  },

  // ── Cross-Functional Collaboration ──
  {
    id: "cf-1",
    category: "Cross-Functional Collaboration",
    text: "Work closely with sales, product, design, engineering, and analytics teams.",
    companyAffinity: ["atlas-robotics", "nexora", "pulseplay"],
    managerAffinity: ["supportive", "demanding"],
  },
  {
    id: "cf-2",
    category: "Cross-Functional Collaboration",
    text: "Coordinate marketing activities across departments.",
    companyAffinity: ["brightwave", "atlas-robotics"],
    managerAffinity: ["detail-oriented", "supportive"],
  },
  {
    id: "cf-3",
    category: "Cross-Functional Collaboration",
    text: "Gather feedback from sales conversations, demos, and events to refine messaging.",
    companyAffinity: ["nexora", "atlas-robotics"],
    managerAffinity: ["detail-oriented"],
  },
  {
    id: "cf-4",
    category: "Cross-Functional Collaboration",
    text: "Ensure alignment between marketing strategies and company goals.",
    companyAffinity: ["brightwave", "nexora", "atlas-robotics"],
    managerAffinity: ["demanding", "detail-oriented"],
  },

  // ── Events & External Engagement ──
  {
    id: "ev-1",
    category: "Events & External Engagement",
    text: "Support marketing activities at conferences and industry events.",
    companyAffinity: ["atlas-robotics", "nexora"],
    managerAffinity: ["supportive"],
  },
  {
    id: "ev-2",
    category: "Events & External Engagement",
    text: "Prepare event materials such as presentations and marketing collateral.",
    companyAffinity: ["brightwave", "atlas-robotics"],
    managerAffinity: ["detail-oriented", "supportive"],
  },
  {
    id: "ev-3",
    category: "Events & External Engagement",
    text: "Assist with event follow-ups and relationship management.",
    companyAffinity: ["brightwave", "nexora"],
    managerAffinity: ["supportive"],
  },

  // ── Marketing Operations & Project Coordination ──
  {
    id: "mo-1",
    category: "Marketing Operations & Project Coordination",
    text: "Maintain marketing budgets, trackers, and documentation systems.",
    companyAffinity: ["atlas-robotics", "brightwave"],
    managerAffinity: ["detail-oriented"],
  },
  {
    id: "mo-2",
    category: "Marketing Operations & Project Coordination",
    text: "Manage timelines and ensure campaign deliverables are completed on schedule.",
    companyAffinity: ["brightwave", "nexora", "atlas-robotics"],
    managerAffinity: ["demanding", "detail-oriented"],
  },
  {
    id: "mo-3",
    category: "Marketing Operations & Project Coordination",
    text: "Process vendor invoices and support marketing operations workflows.",
    companyAffinity: ["atlas-robotics", "brightwave"],
    managerAffinity: ["detail-oriented"],
  },
  {
    id: "mo-4",
    category: "Marketing Operations & Project Coordination",
    text: "Improve marketing processes and operational efficiency.",
    companyAffinity: ["nexora", "atlas-robotics"],
    managerAffinity: ["demanding"],
  },
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
 * Select personalized responsibilities based on duration, company, and manager style.
 * Uses a scoring + seeded-shuffle approach so the same user gets variety while
 * still being weighted toward their company/manager affinity.
 */
export function selectResponsibilities(
  durationWeeks: number,
  companyId: string,
  managerStyle: string,
  /** Seed for deterministic shuffling (e.g. `${userId}-${companyId}`) */
  seed?: string,
): Responsibility[] {
  const count = RESPONSIBILITY_COUNT[durationWeeks] ?? 6;

  // Score each responsibility
  const scored = ALL_RESPONSIBILITIES.map((r) => {
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

  // First pass: one from each category (ordered by score)
  for (const r of scored) {
    if (selected.length >= count) break;
    if (!usedCategories.has(r.category)) {
      selected.push(r);
      usedCategories.add(r.category);
    } else {
      remaining.push(r);
    }
  }

  // Second pass: fill remaining slots from the highest-scored leftovers
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
